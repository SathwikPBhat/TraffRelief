const Staff = require('../models/staff.js');

const handleAddStaff = async (req, res) => {
    try {
        const { fullName, email, phoneNumber, password, center } = req.body;
        if(!fullName|| !email|| !phoneNumber || !password|| !center) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        if(!fullName.trim() || !email.trim() || !phoneNumber.trim() || !password.trim() || !center.trim()) {
            return res.status(400).json({ message: 'All fields are required.' });
        }
        const lastStaff = await Staff.findOne().sort({staffId:-1});
        let idNo = 101;
        if(lastStaff){
            // console.log(lastStaff.staffId);
            const lastId = lastStaff.staffId.substring(2);
            idNo = parseInt(lastId) + 1;
        }
        const newStaff = ({
            staffId : `S-${idNo}`,
            fullName: fullName,
            email: email,   
            mobileNo: phoneNumber,
            password: password,
            center: center,
            
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
    handleAddStaff,
}