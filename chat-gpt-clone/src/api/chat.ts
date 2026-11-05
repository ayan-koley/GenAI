import { Request } from "express";
import { prisma } from "../lib/prisma.js";
import { streamText } from 'ai'
import { getChatModel } from "../config/ai.js";
import 'dotenv/config';

export async function chatLLM(req: Request, conversation_id: string) {
    try {
        const message = req.body?.message;

        if (typeof message?.content !== "string" || !message.content.trim() || !conversation_id) {
            throw new Error("A non-empty message.content and conversation_id are required.");
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

        const modelMessages = previousMessages
            .filter(msg => msg.role === "USER" || msg.role === "ASSISTANT" || msg.role === "SYSTEM")
            .map(msg => ({
                role: msg.role.toLowerCase() as "user" | "assistant" | "system",
                content: msg.content,
            }));

        // llm call 
        const result = streamText({
            model: getChatModel(conversation.model_id),
            system: conversation.system_prompt ?? "You are a helpful assistant.",
            messages: modelMessages,
            onFinish: async ({ text }) => {
                await prisma.message.create({
                    data: {
                        conversation_id,
                        role: "ASSISTANT",
                        status: "COMPLETE",
                        content: text,
                        model_id: conversation.model_id,
                        token_used: 0,
                    },
                });
            },
            onError: ({ error }) => {
                console.error("AI stream failed:", error);
            },
        });

        return result;
        

    } catch (error: any) {
        throw new Error(`Error in chatLLM: ${error.message}`);
    }
}   
