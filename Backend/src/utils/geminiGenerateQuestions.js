import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

export const geminiGenerateQuestion = async (prompt) => {
  try {
    const result = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: prompt,
    });

    const questions = await result.text;

    return questions
      .split("\n")
      .map((line) => line.replace(/^\d+[\.\)]\s*/, "").trim())
      .filter((line) => line.length > 0);
  } catch (error) {
    console.error("Gemini generation error:", error);
    throw new Error("Failed to generate questions");
  }
};
