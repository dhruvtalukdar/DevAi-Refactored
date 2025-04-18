import express from "express";
// import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleGenAI } from "@google/genai";

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
 
const router = express.Router();


const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY }); //process.env.GOOGLE_API_KEY!

// async function main() {
//   const response = await ai.models.generateContent({
//     model: "gemini-2.0-flash",
//     contents: "Explain how AI works in a few words",
//   });
//   console.log(response.text);
// }

// main();

router.post('/generate', async(req, res) => {

    const { prompt } = req.body;

    if(!prompt) {
        return res.status(400).json({ error: "Prompt is required" });
    }

    try {
        // const model = genAI.getGenerativeModel({ model: "gemini-pro "});
        // const result = await model.generateContent(prompt);
        // const response = await result.response.text();

        // res.json({ response });

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