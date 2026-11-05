import { Request } from "express";
import { prisma } from "../lib/prisma.js";
import { convertToModelMessages, streamText } from 'ai'
import { getChatModel } from "../config/ai.js";

export async function chatLLM(req: Request) {
    try {
        const { message, conversation_id} = req.body;

        if(!message || !conversation_id) {
            throw new Error("Missing required parameters: message and conversation_id are required.");
        }

        const conversation = await prisma.conversation.findFirst({
            where: {
                id: conversation_id,
                user_id: req.user?.id
            }
        })

        if (!conversation) {
            throw new Error("Conversation not found or does not belong to the user.");
        }

        const previousMessages = await prisma.message.findMany({
            where: {
                conversation_id: conversation_id
            },
            orderBy: {
                createdAt: 'asc'
            }
        })

        // llm call 
        const result = streamText({
            model: getChatModel(conversation.model_id),
            system: "You are a helpful assistant.",
            messages: await convertToModelMessages([...previousMessages, message])
        })

        for await (const chunk of result.textStream) {
            console.log(chunk);
        }


    } catch (error: any) {
        throw new Error(`Error in chatLLM: ${error.message}`);
    }
}   