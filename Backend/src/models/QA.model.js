const mongoose = require("mongoose");

const questionAnswerSchema = new mongoose.Schema(
  {
    question: { type: String, required: true },
    answer: { type: String },
    followUp: { type: String },
    aiFeedback: { type: String },
  },
  { _id: false }
);

const interviewSchema = new mongoose.Schema(
  {

    name:String,
    userId: { type: String, required: true },
    role: { type: String, required: true },
    jobDescription: {
      type: String,
      required: true,
    },
    resumeFileUrl: {
      type: String,
      required: false,
    },
    level: { type: String },
    duration: { type: Number },

    status: {
      type: String,
      enum: ["in-progress", "completed"],
      default: "in-progress",
    },

    questions: [questionAnswerSchema],

    overallScore: { type: Number }, 
    summaryFeedback: { type: String }, 
    userDataId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserData",
    },
  },
  { timestamps: true }
);

const InterviewSession = mongoose.model("InterviewSession", interviewSchema);
module.exports  = InterviewSession
