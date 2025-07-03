const express =  require("express");
const userData = express.Router();
const upload =  require("../middlewares/multer.js")

//const {requireAuth } =  require("@clerk/express");
const {getUserData , allInterview} = require("../controllers/userData.controller.js");


// userData.post("/userDataUpload" , requireAuth() ,upload.single("resume") ,getUserData);
userData.post("/userDataUpload"  ,upload.single("resume") ,getUserData);

userData.get("/allInterviews", allInterview)
module.exports = userData
