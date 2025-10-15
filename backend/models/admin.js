const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
    adminId:{
        type: String,
        required: true,
        unique: true,
    },
    fullName:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true,
        lowercase:true
    },
    password:{
        type: String,
        required: [true, "Password is required"],
        unique:true
    },
    mobileNo:{
        type: String,
        required: true,
        unique:true
    }
},
{ timestamps: true });

module.exports = mongoose.model("Admin", adminSchema);