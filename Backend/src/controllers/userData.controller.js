const { getAuth }  =  require("@clerk/express")
const cloudinary = require("../utils/cloudinary.js");
const pdfParse = require("pdf-parse");
const { geminiGenerateQuestion } = require("../utils/geminiGenerateQuestions.js");
const InterviewSession = require("../models/QA.model.js");

const getUserData = async (req, res) => {
  try {
    // const { userId } = getAuth(req);
    const userId = "123jd"; 

    const { level, duration, role, jobDescription , name } = req.body;
    const file = req.file;

    if (!level || !duration || !role || !jobDescription || !file || !name) {
      return res
        .status(404)
        .json({ success: false, message: "All Fields Data Required!!" });
    }

    const streamUpload = () =>
      new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            resource_type: "raw",
            folder: "resumes",
            public_id: `${file.originalname}-${Date.now()}`,
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(file.buffer);
      });

    const cloudResult = await streamUpload();

    const parsedpdf = await pdfParse(file.buffer);
    const resumeText = parsedpdf.text;

  
    const prompt = `
You are an interviewer.

Greet the applicant by name once at the beginning line hello ${name} Let's Start the interview!!. Then, based on the following role, level, job description, and resume, generate **exactly 5 to 7 concise and relevant interview questions only**.
Do NOT include any commentary, summaries, or explanations.

Format:
1. Question?
2. Question?
...

Applicant Name: ${name}
Role: ${role}
Level: ${level}
Job Description: ${jobDescription}
Resume: ${resumeText}
`;



    const questionByGemini = await geminiGenerateQuestion(prompt); // [string]

    const questions = questionByGemini.map((q) => ({
      question: q,
      answer: "",
      followUp: "",
      aiFeedback: "",
    }));

    const interview = new InterviewSession({
      name,
      userId,
      level,
      duration,
      role,
      resumeFileUrl: cloudResult.secure_url,
      jobDescription,
      questions,
      status: "in-progress",
  
    });

    await interview.save();

    return res.status(201).json({
      success: true,
      message: "Interview started successfully",
      interviewId: interview._id,
      data:interview
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: error.message });
  }
};



const allInterview = async(req, res)=>{
  try {
    const userId = "123jd";

    const userInfo = await InterviewSession.find({userId}).sort({createdAt : -1});

    if(!userInfo || userInfo.length===0) return res.status(400).json({message:"Give your first Interview!!"})
    
      return res.status(200).json({success:true,size: userInfo.length , data: userInfo})
  } catch (error) {
    return res.status(500).json({success:false , message:error.message})
  }
}

module.exports = {getUserData ,  allInterview};