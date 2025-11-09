const Staff = require('../models/staff.js');
const Victim = require('../models/victim.js');

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

module.exports = {getVictims, getVictimById, getStaffById};