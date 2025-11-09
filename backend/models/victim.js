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


const initialDetailsSchema = new mongoose.Schema({
    injuriesSustained: {
        type: [String],
        default: []
    },
    otherInjuries: {
        type: String,
        default: ""
    },
    physicalDisabilities: {
        type: [String],
        default: []
    },
    otherDisabilities: {
        type: String,
        default: ""
    },
    pregnancyStatus: {
        type: String,
        default: ""
    },
    stiStatus: {
        type: String,
        default: ""
    },
    substanceAbuse: {
        type: [String],
        default: []
    },
    otherSubstanceAbuse: {
        type: String,
        default: ""
    },
    rescueAttempts: {
        type: String,
        default: ""
    },
    rescueDetails: {
        type: String,
        default: ""
    },
    legalStatus: {
        type: String,
        default: ""
    },
    photo: {
        type: String,
        default: ""
    },
    addedAt: {
        type: Date,
        default: Date.now
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
        enum: ['active','released','missing','deceased','unassigned'],
        default: 'unassigned',
    },
    caseDetailsForAdmin:{
        type: caseDetailsForAdminSchema,
    },
    initialDetails: {
        type: initialDetailsSchema,
    }
},{timestamps: true});

module.exports = mongoose.model('Victim', victimSchema);