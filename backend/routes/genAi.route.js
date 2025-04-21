import express from "express";
import { GoogleGenAI } from "@google/genai";

const router = express.Router();
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

router.post('/generate', async(req, res) => {

    const { prompt } = req.body;

    if(!prompt) {
        return res.status(400).json({ error: "Prompt is required" });
    }

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: prompt,
          });
          console.log(response.text);
          res.json({response: response.text});
    }
    catch(error) {
        console.error("Gemini Error:", error);
        res.status(500).json({ error: "Failed to get response from Gemini" });
    }
})

export default router;