const jwt = require('jsonwebtoken');
const Staff = require('../models/staff.js');
const Admin = require('../models/admin.js');

const handleLogin = async(req, res) =>{
    try{
        const {role, id, password} = req.body;

        if(!role || !id || !password){
            return res.status(400).json({message: 'All fields are required'});
        }

        if(!id.trim() || !password.trim()){
            return res.status(400).json({message: 'All fields are required'});
        }  
        if(role === 'admin'){
            const foundAdmin = await Admin.findOne({adminId: id, password: password});
            if(!foundAdmin){
                return res.status(400).json({message : "Invalid credentials"});
            }   
            else{
                const token = jwt.sign({id: foundAdmin.adminId, role: 'admin'}, process.env.SECRET_KEY, {expiresIn: '2h'});
                return res.status(200).json({message : "Admin login successful", token:token});
            }
        }   
        else if(role === 'staff'){
           const foundStaff = await Staff.findOne({staffId:id, password: password});
           if(!foundStaff){
                return res.status(400).json({message : "Invalid credentials"});
           }
           else{
                const token = jwt.sign({id: foundStaff.staffId, role:'staff'}, process.env.SECRET_KEY, {expiresIn: "2h"});
                return res.status(200).json({message : "Staff login successful", token: token});
           }
        }
        else{
            return res.status(400).json({message : "Invalid role"});
        }
    }
    catch(err){
        return res.status(500).json({message:err.message});
    }

}

module.exports = {handleLogin}