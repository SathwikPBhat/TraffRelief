const Admin = require('../models/admin.js');
const Centre = require('../models/centre.js');
const Staff = require('../models/staff.js');

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



module.exports = {getStaffDetails, getCentreDetails, getDistinctRoles}