require("dotenv").config();

const fs = require("fs");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const axios = require("axios");
const { v4: uuidv4 } = require("uuid");

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const BERT_URL = process.env.BERT_PREDICTION_URL; // Your FastAPI endpoint
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

const Release = require("../models/release.js");
const Staff = require("../models/staff.js");
const Victim = require("../models/victim.js");

const createRelease = async (req, res) => {
  try {
    const { staffId, victimId } = req.params;
    if (!staffId || !victimId) {
      return res.status(400).json({ error: "staffId and victimId parameters are required" });
    }

    // optional body validation
    // if (!req.body) return res.status(400).json({ error: "Request body is required" });

    const victim = await Victim.findOne({ victimId: victimId });
    if (!victim) {
      return res.status(404).json({ error: "Victim not found" });
    }

    const staff = await Staff.findOne({ staffId: staffId });
    if (!staff) {
      return res.status(404).json({ error: "Staff not found" });
    }

    if (victim.status !== "released") {
      return res.status(400).json({ error: "Victim is not marked as Released" });
    }

    const hash = uuidv4();

    const newRelease = new Release({
      victimId: victim._id,
      staffId: staff._id,
      scheduledDate:  Date.now(),
      transcription: null,
      summary: null,
      results: {},
      hashLink: hash,
      submitted: false,
    });

    await newRelease.save();

    return res.status(201).json({
      message: "Release created successfully",
      release: {
        id: newRelease._id,
        hashLink: newRelease.hashLink,
        submitted: newRelease.submitted,
      },
    });
  } catch (error) {
    console.error("Error creating release:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

async function submitRelease(req, res) {
  try {
    const { hashId } = req.params;
    if (!hashId) {
      return res.status(400).json({ error: "hashId parameter is required" });
    }

    if (!req.file || !req.file.path) {
      return res.status(400).json({ error: "Audio file is required (field name: 'audio')" });
    }

    const audioPath = req.file.path;

    // read and delete uploaded file
    const audioBytes = fs.readFileSync(audioPath).toString("base64");
    try { fs.unlinkSync(audioPath); } catch (e) { /* ignore */ }

    // Transcription
    const transcriptionPrompt = "Transcribe this audio accurately in English. If it's another Indian language, translate it to English.";

    const transcriptionResult = await model.generateContent([
      { text: transcriptionPrompt },
      { inlineData: { mimeType: "audio/mp3", data: audioBytes } },
    ]);

    const transcript = transcriptionResult.response.text().trim();
    console.log("Transcript:", transcript);

    // Summarization
    const summarizationPrompt = `Summarize this text in one emotionally-aware English sentence. Keep distress or emotion keywords intact.\nText: "${transcript}"`;

    const summaryResult = await model.generateContent([{ text: summarizationPrompt }]);
    const summary = summaryResult.response.text().trim();
    console.log("Summary:", summary);

    // BERT / classification
    const bertResp = await axios.post(BERT_URL, { text: summary });
    const result = bertResp.data;
    console.log("BERT Analysis:", result);

    // find release record
    const releaseRecord = await Release.findOne({ hashLink: hashId });
    if (!releaseRecord) {
      return res.status(404).json({ error: "Release record not found" });
    }
    if (releaseRecord.submitted) {
      return res.status(400).json({ error: "Release has already been submitted" });
    }

    // ensure results object exists
    releaseRecord.submitted = true;
    releaseRecord.submittedTime = Date.now();
    releaseRecord.transcription = transcript;
    releaseRecord.summary = summary;
    releaseRecord.results = releaseRecord.results || {};

    // map BERT scores into results safely
    if (result && result.scores) {
      releaseRecord.results.anxiety = String(result.scores.LABEL_0 || 0);
      releaseRecord.results.bipolar = String(result.scores.LABEL_1 || 0);
      releaseRecord.results.depression = String(result.scores.LABEL_2 || 0);
      releaseRecord.results.normal = String(result.scores.LABEL_3 || 0);
      releaseRecord.results.personality_disorder = String(result.scores.LABEL_4 || 0);
      releaseRecord.results.stress = String(result.scores.LABEL_5 || 0);
      releaseRecord.results.suicidal = String(result.scores.LABEL_6 || 0);

      // pick top label
      let highest = -1;
      let highestkey = "";
      for (const key in result.scores) {
        if (result.scores[key] > highest) {
          highest = result.scores[key];
          highestkey = key;
        }
      }
      const labelMap = {
        LABEL_0: "anxiety",
        LABEL_1: "bipolar",
        LABEL_2: "depression",
        LABEL_3: "normal",
        LABEL_4: "personality_disorder",
        LABEL_5: "stress",
        LABEL_6: "suicidal",
      };
      releaseRecord.verdict = labelMap[highestkey] || "";
    }

    await releaseRecord.save();

    return res.status(200).json({ message: "Release submitted successfully", release: releaseRecord });
  } catch (error) {
    console.error("Error submitting release:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function viewReleaseResults(req, res) {
  try {
    const { hashId } = req.params;
    if (!hashId) {
      return res.status(400).json({ error: "hashId parameter is required" });
    }

    const releaseRecord = await Release.findOne({ hashLink: hashId }).populate("victimId").populate("staffId");
    if (!releaseRecord) {
      return res.status(404).json({ error: "Release record not found" });
    }

    if (!releaseRecord.submitted) {
      return res.status(400).json({ error: "Release has not been submitted yet" });
    }

    return res.status(200).json({ release: releaseRecord });
  } catch (error) {
    console.error("Error fetching release results:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
/*
async function viewReleaseByVictim(req,res){
  try{
    const {victimId}= req.params;
    if(!victimId){
        return res.status(400).json({ error: "victimId parameter is required" });
    }

    const victim= await Victim.findOne({ victimId });
    if(!victim){
        return res.status(404).json({ error: "Victim not found" });
    }
    const releaseRecord= await Release.find({ victimId:victim._id});
    if(!releaseRecord){
        return res.status(404).json({ error: "Release record not found" });
    }
    return res.status(200).json({ release: releaseRecord });
  } catch (error) {
      console.error("Error fetching release by victim:", error);
      res.status(500).json({ error: "Internal server error" });
  }   
}
*/
// ...existing code...
async function viewReleaseByVictim(req,res){
  try{
    const {victimId}= req.params;
    if(!victimId){
        return res.status(400).json({ error: "victimId parameter is required" });
    }

    const victim= await Victim.findOne({ victimId });
    if(!victim){
        return res.status(404).json({ error: "Victim not found" });
    }

    // fetch all releases for this victim, populate staff and victim, sort newest first
    const releaseRecords = await Release.find({ victimId: victim._id })
      .populate("staffId", "staffId fullName email")
      .populate("victimId", "victimId fullName")
      .sort({ createdAt: -1 });

    if (!Array.isArray(releaseRecords) || releaseRecords.length === 0) {
        return res.status(404).json({ error: "No release records found for this victim" });
    }

    return res.status(200).json({ releases: releaseRecords });
  } catch (error) {
      console.error("Error fetching release by victim:", error);
      res.status(500).json({ error: "Internal server error" });
  }   
}
// ...existing code...
module.exports = { createRelease, submitRelease, viewReleaseResults, viewReleaseByVictim };