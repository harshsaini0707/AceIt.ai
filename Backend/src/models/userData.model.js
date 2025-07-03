const mongoose = require("mongoose");

const userDataSchema = new mongoose.Schema({
    userId:{
        type:String,
        required:true,
    },
    level:{
       type:String,
        required:true, 
    },
    duration:{
        type:Number,
        required:true
    },
    role:{
        type:String,
        required:true
    },
    resumeFileUrl: {
    type: String,
    required: false
},
    resumeText:{
        type:String,
       
    },
    jobDescription:{
        type:String,
        required:true
    }

},{timestamps:true});

const UserData = mongoose.model("UserData",userDataSchema);

module.exports = UserData;