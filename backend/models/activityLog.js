const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
    adminId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin"
    },
    staffId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Staff"
    },
    timestamp:{
        type: Date,
        default: Date.now()
    },
    activity:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    readStatus:{
        type: Boolean,
        default: false
    }
},{timestamps:true});

module.exports = mongoose.model("ActivityLog",activityLogSchema);