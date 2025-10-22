const mongoose = require("mongoose");

const staffSchema = new mongoose.Schema({
    staffId:{
        type:String,
        required:true,
        unique:true
    },
    fullName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true
    },
    password:{
        type:String,
        required:[true,"Password is required"],
    },
    mobileNo:{
        type:String,
        required:true,
        unique:true  
    },
    status:{
        type:String,
        enum:["active","inactive"],
        default:"active"
    },
    role:{
        type:String,
    },
    centre:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Centre",
    },
    reportsTo:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Admin"
    }
},{timestamps:true})

module.exports = mongoose.model("Staff", staffSchema);