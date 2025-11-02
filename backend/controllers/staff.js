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

module.exports = {getVictims}