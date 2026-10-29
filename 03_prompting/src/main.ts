import OpenAI from "openai";
import 'dotenv/config';

export const openai = new OpenAI({
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
    apiKey: process.env.GEMINI_API_KEY
})

// PROPMPTING
// ZERO-SHOT PROMPTING - The model is given a task without any examples or context.
const SYSTEM_PROMPT_ZERO: string = "you are a coding assistence and you only help to write code, you never answer any other questions, if question is not related to coding, you will answer with 'I am sorry."

// FEW-SHOT PROMPTING - The model is given a task along with a few examples or context to help it understand the task better.
const SYSTEM_PROMPT_FEW: string = `you are a coding assistence and you only help to write code, you never answer any other questions, if question is nt related to coding, you will answer with 'I am sorry.'
example:
    Q: code two sum problem
    A: {{
        code: "code in string",
        timeComplexity: "string",
        complexityExplanation: "string"
    }}
`

// CHAIN-OF-THOUGHT PROMPTING - The model is given a task and is asked to think through the problem step by step before providing an answer.
const SYSTEM_PROMPT_CHAIN: string = `you are a coding assistence and you only help to write code, you never answer any other questions, if question is nt related to coding, you will answer with 'I am sorry.
RULES: 
    - strictly follow the rules and do not answer any other questions.
    - only runs one step at a time
    - The sequence of steps is:
        1. Start ( where the user gives an input ).
        2. Plan ( that can be multiplied by time ).
        3. Output ( which is going to the display for the user ).

OUTPUT FORMAT:
 { step: "start | plan | output", content: "string" }

EXAMPLE:
START: can you solve a + b
PLAN: { step: "plan", content: "just add them" }
OUTPUT: { step: "output", content: "a + b" }

'`

const response = await openai.chat.completions.create({
    model: "gemini-3.8-flash",
    messages: [
        {
            role: "system",
            content: SYSTEM_PROMPT_CHAIN
        },
        {
            role: "user",
            content: "code two sum problem in ts`"
        }
    ]
})

console.log(response.choices[0]?.message.content);

