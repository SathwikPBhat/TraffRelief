const Staff = require('../models/staff.js');
const Admin = require('../models/admin.js');
const Centre = require('../models/centre.js');
const viewStaffs = async(req, res) =>{
    try{
        const {adminId} = req.params;
        if(!adminId){
            return res.status(400).json({message : "Admin ID is required"});
        }
        const foundAdmin = await Admin.findOne({adminId: adminId});
        if(!foundAdmin){
            return res.status(404).json({message : "Admin not found"});
        }
        const staffs = await Staff.find({reportsTo: foundAdmin._id}).populate('centre');
        return res.status(200).json({message : "Data retrieval succesful",staffs:staffs});
    }
    catch(err){
        return res.status(500).json({message : err.message });
    }
}

const handleAddStaff = async (req, res) => {
    try {
        const { id, fullName, email, phoneNumber, password, role, center } = req.body;
        if(!id){
            return res.status(401).json({message:"Forbidden"});
        }
        if(!fullName|| !email|| !phoneNumber || !password|| !center || !role) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        if(!fullName.trim() || !email.trim() || !phoneNumber.trim() || !password.trim() || !center.trim() || !role.trim()) {
            return res.status(400).json({ message: 'All fields are required.' });
        }
        const lastStaff = await Staff.findOne().sort({staffId:-1});
        let idNo = 101;
        if(lastStaff){
            // console.log(lastStaff.staffId);
            const lastId = lastStaff.staffId.substring(2);
            idNo = parseInt(lastId) + 1;
        }
        const centerDoc = await Centre.findOne({centreName: center});
        if(!centerDoc){
            return res.status(404).json({message : "Centre not found"});
        }   
        const adminDoc = await Admin.findOne({adminId: id});

        const newStaff = ({
            staffId : `S-${idNo}`,
            fullName: fullName,
            email: email,   
            mobileNo: phoneNumber,
            password: password,
            centre: centerDoc._id,
            role: role,
            reportsTo: adminDoc._id
        })
        
        const existingStaff = await Staff.findOne({email : newStaff.email});
        if(existingStaff) {
            return res.status(409).json({ message: 'Staff with this email already exists.' });
        }
        const createdStaff = await Staff.create(newStaff);
        res.status(201).json({message : `Staff created successfully with id: ${createdStaff.staffId}`});

    }
    catch(err){
        return res.status(500).json({ message: 'Internal server error', error: err.message });
    }
}

module.exports={
    handleAddStaff, viewStaffs
}