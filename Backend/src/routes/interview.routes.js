const express = require("express");
const { startInterview } = require("../controllers/startInterview.controllers");

const interviewRouter =  express.Router();

interviewRouter.post("/startInterview/:sessionId" ,  startInterview);

module.exports = interviewRouter