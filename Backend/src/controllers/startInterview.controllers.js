const InterviewSession = require("../models/QA.model");
const { createClient } = require("@deepgram/sdk");
const fs = require("fs");
const path = require("path");
const getAudioBuffer = require("../utils/audioBuffer");
require("dotenv").config();

const deepgram = createClient(process.env.Deepgram_KEY);

import { Readable } from 'stream'
import { AssemblyAI } from 'assemblyai'
import recorder from 'node-record-lpcm16'

   const client = new AssemblyAI({
    apiKey: process.env.Assembly_KEY,
  });

const startInterview = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const session = await InterviewSession.findById(sessionId).select("questions name");
    if (!session) {
      return res.status(404).json({ success: false, message: "Interview not found!" });
    }

    const firstQuestion = session.questions?.[0]?.question;
    if (!firstQuestion) {
      return res.status(400).json({ success: false, message: "No questions found." });
    }

    // TTS
    const response = await deepgram.speak.request(
      { text: firstQuestion },
      {
        model: "aura-2-hermes-en",
        encoding: "linear16",
        container: "wav",
      }
    );
    //stream to buffer
    const stream = await response.getStream();
    const buffer = await getAudioBuffer(stream);

    const audioDir = path.join(__dirname, "../public/audio");
    console.log(audioDir);
    
if (!fs.existsSync(audioDir)) {
  fs.mkdirSync(audioDir, { recursive: true });
}


    const audioFileName = `${sessionId}-q1.wav`;
    const audioFilePath = path.join(__dirname, "../public/audio", audioFileName);
    fs.writeFileSync(audioFilePath, buffer);

    //STT
     const transcriber = client.streaming.transcriber({
    sampleRate: 16_000,
    formatTurns: true
  });
   

    transcriber.on("open", ({ id }) => {
    console.log(`Session opened with ID: ${id}`);
  });

   transcriber.on("error", (error) => {
    console.error("Error:", error);
  });

   transcriber.on("close", (code, reason) =>
    console.log("Session closed:", code, reason),
  );

  
  transcriber.on("turn", (turn) => {
    if (!turn.transcript) {
      return;
    }
    console.log("Turn:", turn.transcript);
  });
  try {
    console.log("Connecting to streaming transcript service");
    await transcriber.connect();
    console.log("Starting recording");
    const recording = recorder.record({
      channels: 1,
      sampleRate: 16_000,
      audioType: "wav", // Linear PCM
    });
    Readable.toWeb(recording.stream()).pipeTo(transcriber.stream());
    // Stop recording and close connection using Ctrl-C.
    process.on("SIGINT", async function () {
      console.log();
      console.log("Stopping recording");
      recording.stop();
      console.log("Closing streaming transcript connection");
      await transcriber.close();
      process.exit();
    });
  } catch (error) {
    console.error(error);
  }

    return res.status(200).json({
      success: true,
      name: session.name,
      question: firstQuestion,
      audioUrl: `/audio/${audioFileName}`,
    });

  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { startInterview };
