const mongoose = require("mongoose");

const centreSchema = new mongoose.Schema({
    centreId:{
        type:String,
        required:true,  
    },
    centreName:{
        type:String,
        required:true,
    },
    address:{
        type:String,
        required:true,
    },
    contactNo:{
        type:String,
        required:true
    },
    certificate:{
        //abhishek complete this
    }
})

module.exports = mongoose.model("Centre", centreSchema);