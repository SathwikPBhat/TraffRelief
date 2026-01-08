const mongoose = require('mongoose');
const Admin = require('../models/admin.js');
const Centre = require('../models/centre.js');
const Staff = require('../models/staff.js');
const Victim = require('../models/victim.js');


const getStaffDetails = async(req, res) => {
    try{
        const {adminId} = req.params;
        console.log(adminId);
        if(!adminId){
            return res.status(401).json({message: "Admin id is required"});
        }
        const foundAdmin = await Admin.findOne({adminId: adminId});
        console.log(foundAdmin);
        const staffs = await Staff.find({reportsTo: foundAdmin._id});
        const total = staffs.length;
        let working = 0;
        staffs.forEach((staff)=>{
            if(staff.status === 'active') working++;
        })
        return res.status(200).json({total: total, working: working});
    }
    
    catch(err){
        return res.status(500).json({message: err.message});
    }
}

const getCentreDetails = async (req, res) =>{
    try{
        const {adminId} = req.params;
        if(!adminId){
            return res.status(401).json({message: "Admin id is required"});
        }
        const foundAdmin = await Admin.findOne({adminId: adminId});
        if(!foundAdmin){    
            return res.status(404).json({message: "Admin not found"});
        }
        const centresWithStaff = await Staff.distinct('centre', {reportsTo: foundAdmin._id});
        const centresWithStaffCount = centresWithStaff.length;
        const centresUnderAdmin = await Centre.find({comesUnder: foundAdmin._id});
        const centresUnderAdminCount = centresUnderAdmin.length;
        const centres = await Centre.distinct("centreName",{comesUnder: foundAdmin._id});
        return res.status(200).json({centresWithStaffCount: centresWithStaffCount, centresUnderAdminCount: centresUnderAdminCount, centres: centres, centresUnderAdmin:centresUnderAdmin});
    }   
    catch(err){
        return res.status(500).json({message: err.message});
    }
}

const getCentresForAnalytics = async (req, res) => {
  try {
    const { adminId } = req.params;
    
    if (!adminId) {
      return res.status(401).json({ message: "Admin id is required" });
    }
    
    const foundAdmin = await Admin.findOne({ adminId: adminId });
    if (!foundAdmin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    
    const centres = await Centre.find({ comesUnder: foundAdmin._id })
      .select('_id centreName centreId')
      .sort({ centreName: 1 });
    
    return res.status(200).json({ centres: centres });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const getDistinctRoles = async(req, res) =>{
    try{
        const {adminId} = req.params;
        console.log(adminId);
        if(!adminId){
            return res.status(401).json({message: "Admin id is required"});
        }
        const roles = await Staff.distinct("role",{});
        return res.status(200).json({message:"successful retrieval", roles:roles});
    }
    catch(err){
        return res.status(500).json({message: err.message});
    }
}

const getVictimDetails = async(req, res) =>{
    try{
        const {adminId} = req.params;
        if(!adminId){
            return res.status(401).json({message: "Admin id is required"});
        }
        const foundAdmin = await Admin.findOne({adminId: adminId});
        if(!foundAdmin){
            return res.status(404).json({message: "Admin not found"});  
        }
        const victims = await Victim.find({admin: foundAdmin._id});
        const total = victims.length;
        let active = 0, missing = 0, released = 0, deceased = 0;
        victims.forEach((victim)=>{
            if(victim.status === 'active') active++;
            else if(victim.status === 'missing') missing++;
            else if(victim.status === 'released') released++;
            else if(victim.status === 'deceased') deceased++;   
        })
        return res.status(200).json({total: total, active: active, missing: missing, released: released, deceased: deceased});
    }
    catch(err){
            return res.status(500).json({message: err.message});
    }
}

const getTraffickingTypes = async(req, res) => {
  try {
    const { adminId } = req.params;
    const { centreId } = req.query;
    
    if (!adminId) {
      return res.status(401).json({ message: "Admin id is required" });
    }
    
    const foundAdmin = await Admin.findOne({ adminId: adminId });
    if (!foundAdmin) {
      return res.status(404).json({ message: "Admin not found" });
    }


    let matchCriteria = { admin: foundAdmin._id };
    
    if (centreId && centreId !== 'all') {
      matchCriteria.centre = new mongoose.Types.ObjectId(centreId);
    }

    const result = await Victim.aggregate([
      {
        $match: matchCriteria
      },
      {
        $group: {
          _id: "$caseDetailsForAdmin.traffickingType",
          totalVictims: { $sum: 1 }
        }
      },
      {
        $match: { _id: { $ne: null, $ne: "" } }
      },
      {
        $sort: { totalVictims: -1 }
      }
    ]);
    
    return res.status(200).json({ traffickingData: result });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const getVictimsByGender = async(req, res) => {
  try {
    const { adminId } = req.params;
    const { centreId } = req.query;
    
    if (!adminId) {
      return res.status(401).json({ message: "Admin id is required" });
    }
    
    const foundAdmin = await Admin.findOne({ adminId: adminId });
    if (!foundAdmin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    let matchCriteria = { admin: foundAdmin._id };
    
    if (centreId && centreId !== 'all') {
      matchCriteria.centre = new mongoose.Types.ObjectId(centreId);
    }

    const result = await Victim.aggregate([
      {
        $match: matchCriteria
      },
      {
        $group: {
          _id: "$gender",
          totalVictims: { $sum: 1 }
        }
      }
    ]);
    
    return res.status(200).json({ victimsByGender: result });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const getVictimsByAge = async(req, res) => {
  try {
    const { adminId } = req.params;
    const { centreId } = req.query;
    
    if (!adminId) {
      return res.status(401).json({ message: "Admin id is required" });
    }
    
    const foundAdmin = await Admin.findOne({ adminId: adminId });
    if (!foundAdmin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    let matchCriteria = { admin: foundAdmin._id };
    
    if (centreId && centreId !== 'all') {
      matchCriteria.centre = new mongoose.Types.ObjectId(centreId);
    }

    const result = await Victim.aggregate([
      {
        $match: matchCriteria
      },
      {
        $bucket: {
          groupBy: "$age",
          boundaries: [0, 13, 18, 25, 35, 50, 65, 200],
          default: "Other",
          output: {
            totalVictims: { $sum: 1 }
          }
        }
      }
    ]);
    
    return res.status(200).json({ victimsByAge: result });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const getVictimsByStatus = async(req, res) =>{
  try{
    const {adminId} = req.params;
    const {centreId} = req.query;

    if(!adminId){
      return res.status(401).json({message : "AdminId is required"});
    }
    const foundAdmin = await Admin.findOne({adminId : adminId});
    if(!foundAdmin){
      return res.status(404).json({message : "Admin not found"})
    }
    let matchCriteria = {admin : foundAdmin._id};
    if(centreId && centreId != 'all'){
      matchCriteria.centre = new mongoose.Types.ObjectId(centreId);
    }
    const result = await Victim.aggregate([
      {
        $match : matchCriteria
      },
      {
        $group: {
          _id: "$status",
          totalVictims: {$sum : 1}
        }
      },
      {
        $sort: {totalVictims: -1}
      }
    ]);

    return res.status(200).json({statusData: result});
  }
  catch(err){
    return res.status(500).json({message : err.message});
  }
}
module.exports = {getStaffDetails, getCentreDetails, getDistinctRoles, getVictimDetails, getTraffickingTypes, getVictimsByGender, getVictimsByAge,getCentresForAnalytics, getVictimsByStatus};