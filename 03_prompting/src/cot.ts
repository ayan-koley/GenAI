import OpenAI from "openai";
import 'dotenv/config';
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";

const openai = new OpenAI({
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
    apiKey: process.env.GEMINI_API_KEY
})

type ChainStep = {
    step: "start" | "plan" | "output";
    content: string;
};

const systemPrompt = `You are a coding assistant.
Work on one step at a time and return only valid JSON:
{"step":"plan"|"output","content":"string"}

Return "plan" while more work is needed. Return "output" only when the
complete answer is ready. Do not reveal private chain-of-thought; provide
short plans and the final answer.`;

const messages: ChatCompletionMessageParam[] = [{
    role: "system",
    content: systemPrompt
}, {
    role: "user",
    content: "Write a TypeScript solution for the two-sum problem."
}];

const maxSteps = 5;

console.log("Starting chain-of-thought prompting...");

for (let stepNumber = 1; stepNumber <= maxSteps; stepNumber++) {
    console.log(`Step ${stepNumber}: Sending messages to the model...`);
    const response = await openai.chat.completions.create({
        model: "gemini-3.8-flash",
        messages
    });

    const rawMessage = response.choices[0]?.message.content;
    if (!rawMessage) {
        throw new Error("The model returned an empty message.");
    }

    let step: ChainStep;
    try {
        step = JSON.parse(rawMessage) as ChainStep;
    } catch {
        throw new Error(`The model returned invalid JSON: ${rawMessage}`);
    }

    console.log(`Step ${stepNumber} (${step.step}):\n${step.content}\n`);

    messages.push({
        role: "assistant",
        content: rawMessage
    });

    if (step.step === "output") {
        console.log(rawMessage);
        break;
    }
    if (stepNumber === maxSteps) {
        throw new Error(`The model did not finish within ${maxSteps} steps.`);
    }
}
