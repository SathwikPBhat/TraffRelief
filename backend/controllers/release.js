require("dotenv").config();

const fs = require("fs");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const BERT_URL = process.env.BERT_PREDICTION_URL; // Your FastAPI endpoint
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
const axios=require('axios');
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

//const summary="The individual expresses a persistent and overwhelming sense of impending doom, indicating significant emotional distress.";
//transcript=" I can't shake this constant feeling that something terrible is about to happen.";
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
        
        releaseRecord.results.anxiety=result.scores.LABEL_0.toString();
        releaseRecord.results.bipolar=result.scores.LABEL_1.toString();
        releaseRecord.results.depression=result.scores.LABEL_2.toString();
        releaseRecord.results.normal=result.scores.LABEL_3.toString();
        releaseRecord.results.personality_disorder=result.scores.LABEL_4.toString();
        releaseRecord.results.stress=result.scores.LABEL_5.toString();
        releaseRecord.results.suicidal=result.scores.LABEL_6.toString();
        let highest=-1;
        let highestkey='';
        for(const key in result.scores){
            if(result.scores[key]>highest){
                highest=result.scores[key];
                highestkey=key;
            }
        }

        if(highestkey==='LABEL_0'){
            highestkey='anxiety';
        }else if(highestkey==='LABEL_1'){
            highestkey='bipolar';
        }else if(highestkey==='LABEL_2'){
            highestkey='depression';
        }else if(highestkey==='LABEL_3'){
            highestkey='normal';
        }else if(highestkey==='LABEL_4'){
            highestkey='personality_disorder';
        }else if(highestkey==='LABEL_5'){
            highestkey='stress';
        }else if(highestkey==='LABEL_6'){
            highestkey='suicidal';
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
