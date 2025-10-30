const mongoose = require('mongoose');

const caseDetailsForAdminSchema = new mongoose.Schema({
    traffickingType:{
        type: String,
        required: true
    },
    traffickingLocations:{
        type: [String]
    },
    traffickingDuration:{
        type: String
    },
    rescueDate:{
        type: Date
    },
    controlMethods:{
        type:[String]
    },
    previousAttemptsToEscape:{
        type: String,
    },
});

const caseDetailsForStaffSchema = new mongoose.Schema({
    medicalHistory:{
        type: String,
    },
    psychologicalState:{        
        type: String,
    },
    specialNeeds:{      
        type: String,
    },
    rehabilitationPlan:{
        type: String,   
    },
    followUpActions:{
        type: String,
    }
});

const victimSchema = new mongoose.Schema({
    victimId:{
        type: String,
        required: true,
        unique: true
    },
    fullName:{
        type: String,
        required: true
    },
    victimImage:{
        type: String,
    },
    age:{
        type: Number,
        required: true
    },
    gender:{
        type: String,
        enum: ['M', 'F','O'],
        required: true
    },
    languagesSpoken:{
        type: [String],
        required: true
    },
    centre:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Centre',
    },
    staff:{
        type: mongoose.Schema.Types.ObjectId,   
        ref: 'Staff',
    },
    audits:{
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Audit'
    },
    admin:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin',
    },
    status:{
        type: String,
        enum: ['active','released','missing','deceased'],
        default: 'active',
    },
    caseDetailsForAdmin:{
        type: caseDetailsForAdminSchema,
    },
    caseDetailsForVictim:{
        type: caseDetailsForStaffSchema,
    }
},{timestamps: true});

module.exports = mongoose.model('Victim', victimSchema);
