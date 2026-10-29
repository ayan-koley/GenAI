import OpenAI from "openai";
import 'dotenv/config';

const openai = new OpenAI({
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
    apiKey: process.env.GEMINI_API_KEY
})

const response = await openai.chat.completions.create({
    model: "gemini-3.8-flash",
    messages: [
        {
            role: "user",
            content: "hi there, who are you ?"
        }
    ]
})

console.log(response.choices[0]?.message.content);

