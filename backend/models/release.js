const mongoose= require('mongoose');
const victim = require('./victim');

const releaseSchema=new mongoose.Schema({
    scheduledDate:{
        type:Date,
        required:true
    },
    submittedTime:{
        type:Date,
        default:null
    },
    victimId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Victim',
        required:true
    },

    staffId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Staff',
        required:true
    },
    transcription:{
        type:String,
        
    },
    summary:{
        type:String,
        
    },
   results:{
    bipolar:String,
depression:String,
	normal:String,
 personality_disorder:String,
stress:String,
suicidal:String
   },
   submitted:{
    type:Boolean,
    default:false
   },
   hashLink:{
    type:String,
    required:true
   },

   verdict:{
    type:String,
    default:null

}}
);

   module.exports=mongoose.model("Release",releaseSchema);
   
    