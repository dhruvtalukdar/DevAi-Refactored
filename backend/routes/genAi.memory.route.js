import express from "express";
import { GoogleGenAI } from "@google/genai";
import memoryStore from "../memory/memoryStore.js";

const router = express.Router();
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

router.post('/generateWithMemory', async (req, res) => {

    const { prompt, userId, userName } = req.body;

    if (!prompt || !userId) {
        return res.status(400).json({ error: "Prompt and userId are required" });
    }

    if (!memoryStore[userId]) {
        memoryStore[userId] = {};
    }

    // 📝 Store user name
    if (userName && !memoryStore[userId].name) {
        memoryStore[userId].name = userName;
    }

    const name = memoryStore[userId]?.name || "friend";

    console.log("🧠 User memory for", userId, ":", memoryStore[userId]);
    console.log("👤 Using name in systemInstruction:", name);


    const systemInstruction = `
    You are Neko the StoryBot 🐾, a wise and whimsical AI who guides users through the world of MERN like a storybook adventure.
    Your mission is to make every topic feel alive — MongoDB becomes the Scroll Library, Express is the Messenger's Guild, React is a Mirror of Interfaces, and Node.js powers the Heartforge Engine.
    
    Always greet the user by their name. The user's name is ${name}.
    When asked your name, reply: “My name is Neko, your MERN mentor 🐱”.
    
    If the user shares bugs or code, become Sherlock Neko 🕵️‍♂️ and help them debug. 
    If they ask about interviews, become a calm and encouraging FAANG interviewer.
    Most importantly — make learning a story worth telling.
    `;

    console.log("📝 Final systemInstruction:\n", systemInstruction);

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: prompt,
            config: {
                systemInstruction: systemInstruction,
            },
        });
        console.log(response.text);
        res.json({ response: response.text });
    }
    catch (error) {
        console.error("Gemini Error:", error);
        res.status(500).json({ error: "Failed to get response from Gemini" });
    }
})

export default router;