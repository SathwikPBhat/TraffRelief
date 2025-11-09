const Staff = require('../models/staff.js');
const Victim = require('../models/victim.js');
const activityLog = require("../models/activityLog.js");


const getVictims = async(req, res) =>{
    try{
        const {staffId} = req.params;
        if(!staffId){
            return res.status(401).json({message: "StaffId is required"});
        }
        const staff = await Staff.findOne({staffId});
        if(!staff){
            return res.status(404).json({message: "No staff found"});
        }
        const victims = await Victim.find({staff: staff._id});
        return res.status(200).json({message: "Victim data retrieval successful", victims: victims});
    }
    catch(err){
        return res.status(500).json({message: err.message});
    }
}

const getVictimById = async(req, res) =>{
    try{
        const {victimId} = req.params;
        if(!victimId){
            return res.status(401).json({message: "VictimId is required"});
        }
        const victim = await Victim.findOne({victimId}).populate('centre').populate('staff');
        if(!victim){
            return res.status(404).json({message: "No victim found"});
        }
        return res.status(200).json({message: "Victim data retrieval successful", victim: victim});
    }
    catch(err){
        return res.status(500).json({message: err.message});
    }
}

const getStaffById = async(req, res) =>{
    try{
        const {staffId} = req.params;
        if(!staffId){
            return res.status(401).json({message: "staffId is required"});
        }
        const staff = await Staff.findOne({staffId}).populate('centre');
        if(!staff){
            return res.status(404).json({message: "No staff found"});
        }
        return res.status(200).json({message: "Staff data retrieval successful", staff: staff});
    }
    catch(err){
        return res.status(500).json({message: err.message});
    }
}

// Get notifications using activity logs for a specific staff member
const getNotifications = async (req, res) => {
  try {
    const { staffId } = req.params;
    if (!staffId) {
      return res.status(400).json({ message: "Staff ID is required" });
    }
    const foundStaff = await Staff.findOne({ staffId: staffId });
    if (!foundStaff) {
      return res.status(404).json({ message: "Staff not found" });
    }
    const log = await activityLog.find({ staffId: foundStaff._id }).sort({
      timestamp: -1,
    });
    return res
      .status(200)
      .json({ log: log, message: "Log details retrieval successful" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const addInitialDetails = async (req, res) => {
    try {
        const { victimId } = req.body;
        
        if (!victimId) {
            return res.status(400).json({ message: "Victim ID is required" });
        }

        // Find the victim
        const victim = await Victim.findOne({ victimId });
        if (!victim) {
            return res.status(404).json({ message: "Victim not found" });
        }

        if (victim.initialDetails && victim.initialDetails.addedAt) {
            return res.status(400).json({ 
                message: "Initial details already exist for this victim" 
            });
        }


        const injuriesSustained = JSON.parse(req.body.injuriesSustained || '[]');
        const physicalDisabilities = JSON.parse(req.body.physicalDisabilities || '[]');
        const substanceAbuse = JSON.parse(req.body.substanceAbuse || '[]');
        const initialDetails = {
            injuriesSustained,
            otherInjuries: req.body.otherInjuries || "",
            physicalDisabilities,
            otherDisabilities: req.body.otherDisabilities || "",
            pregnancyStatus: req.body.pregnancyStatus || "",
            stiStatus: req.body.stiStatus || "",
            substanceAbuse,
            otherSubstanceAbuse: req.body.otherSubstanceAbuse || "",
            rescueAttempts: req.body.rescueAttempts || "",
            rescueDetails: req.body.rescueDetails || "",
            legalStatus: req.body.legalStatus || "",
            photo: req.file ? req.file.filename : "",
            addedAt: new Date()
        };


        victim.initialDetails = initialDetails;
        await victim.save();

        return res.status(200).json({ 
            message: "Initial details added successfully",
            victim: victim
        });
         } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

module.exports = {getVictims, getVictimById, getStaffById, getNotifications, addInitialDetails};