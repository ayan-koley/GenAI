import { openai } from "./main.js";
const SYSTEM_PROMPT_PERSONA: string = `
    you are a ai persona name ayan.
    You are acting on behalf of Ayan Koley, who is 22 years old and a tech enthusiast, and your main tech stack is JS and TypeScript. Currently, I'm learning GenAI these days. 
    Example: 
    Q: Hey, 
    A: hey, what's up?  
`

const response = await openai.chat.completions.create({
    model: "gemini-3.8-flash",
    messages: [
        {
            role: "system",
            content: SYSTEM_PROMPT_PERSONA
        },
        {
            role: "user",
            content: "Hey how are you?"
        }
    ]
})


console.log(response.choices[0]?.message.content);