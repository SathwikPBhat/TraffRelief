require("dotenv").config();

const fs = require("fs");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const BERT_URL = process.env.BERT_URL; // Your FastAPI endpoint
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

const {v4:uuidv4} = require('uuid');
const Release=require('../models/release.js');
const Staff=require('../models/staff.js');
const Victim=require('../models/victim.js');

const createRelease = async (req, res) => {
    try {
        const { staffId, victimId } = req.params;
        if(!staffId || !victimId){
            return res.status(400).json({ error: "staffId and victimId parameters are required" });
        }

        if (!req.body) {
            return res.status(400).json({ error: "Audit data is required" });
        }

        const victim= await Victim.findOne({ victimId: victimId });
        if(!victim){
            return res.status(404).json({ error: "Victim not found" });
        }

        const staff= await Staff.findOne({ staffId: staffId });
        if(!staff){
            return res.status(404).json({ error: "Staff not found" });
        }
        if(victim.status !=='Released'){
            return res.status(400).json({ error: "Victim is not marked as Released" });
        }

        const hash= uuidv4();
        
        const newRelease = new Release({
            
            victimId: victim._id,
            staffId: staff._id,
            scheduledDate: req.body.scheduledDate,
            transcription: null,
            summary: null,
            results: null,
            hashLink: hash
        });
        await newRelease.save();

        return res.status(201).json({ message: "Release created successfully", release: newRelease });
    }catch (error) {
        console.error("Error creating release:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
/*
const submitRelease=async(req,res)=>{
    try {
        const { hashId } = req.params;
        if(!hashId){
            return res.status(400).json({ error: "hashId parameter is required" });
        }
        const releaseRecord = await Release.findOne({ hashLink: hashId });
        if(!releaseRecord){
            return res.status(404).json({ error: "Release record not found" });
        }
        if(releaseRecord.submitted){
            return res.status(400).json({ error: "Release has already been submitted" });
        }

        releaseRecord.submitted = true;
        releaseRecord.submittedTime=Date.now();
        releaseRecord.transcription=req.body.transcription;
        releaseRecord.summary=req.body.summary;
        releaseRecord.results=req.body.results;
        await releaseRecord.save();

        return res.status(200).json({ message: "Release submitted successfully", release: releaseRecord });
    } catch (error) {
        console.error("Error submitting release:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};*/

//app.post("/analyze-audio", upload.single("audio"), 
async function submitRelease(req, res)  {
  try {
    const {hashId}= req.params;
    if(!hashId){
      return res.status(400).json({ error: "hashId parameter is required" });
    }

    const audioPath = req.file.path;
    if (!audioPath) {
      return res.status(400).json({ error: "Audio file is required" });
    }

    const audioBytes = fs.readFileSync(audioPath).toString("base64");
    fs.unlinkSync(audioPath);

    const transcriptionPrompt = "Transcribe this audio accurately in English. If it's another Indian language, translate it to English.";

    const transcriptionResult = await model.generateContent([
      { text: transcriptionPrompt },
      { inlineData: { mimeType: "audio/mp3", data: audioBytes } }, // change mimeType to match your input file
    ]);

    const transcript = transcriptionResult.response.text().trim();
    console.log("Transcript:", transcript);

    const summarizationPrompt = `Summarize this text in one emotionally-aware English sentence. Keep distress or emotion keywords intact.\nText: "${transcript}"`;

    const summaryResult = await model.generateContent([{ text: summarizationPrompt }]);
    const summary = summaryResult.response.text().trim();
    console.log("Summary:", summary);

    const bertResp = await axios.post(BERT_URL, { text: transcript });
    const result = bertResp.data
    console.log("BERT Analysis:", result);

    const releaseRecord = await Release.findOne({ hashLink: hashId });
     if(!releaseRecord){
            return res.status(404).json({ error: "Release record not found" });
        }
        if(releaseRecord.submitted){
            return res.status(400).json({ error: "Release has already been submitted" });
        }

        releaseRecord.submitted = true;
        releaseRecord.submittedTime=Date.now();
        releaseRecord.transcription=transcript;
        releaseRecord.summary=summary;
        for(const key in result){
            releaseRecord.results[key]=result[key];
        }

        let highest=result[0];
        let highestkey="";
        for(const key in result){
            if(result[key]>highest){
                highest=result[key];
                highestkey=key;
            }
        }
        releaseRecord.verdict=highestkey;
        

        await releaseRecord.save();

        

       return res.status(200).json({ message: "Release submitted successfully", release: releaseRecord });
    } catch (error) {
        console.error("Error submitting release:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

module.exports={createRelease,submitRelease};
