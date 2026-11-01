import { Request } from "express";
import { prisma } from "../lib/prisma.js";
import { Conversation, Message } from "../types/models/index.js";

export async function getUserConversations(req: Request): Promise<Conversation[]> {
    const user = req.user;
    if (!user) {
        throw new Error("User not authenticated");
    }
    
    // Query the database for conversations belonging to the user
    // Example: const conversations = await prisma.conversation.findMany({ where: { userId: user.id } });
    const conversations = await prisma.conversation.findMany({
        where: {
            user_id: user.id
        }
    })
    
    return conversations;
}

export async function createConversationRecord(req: Request): Promise<Conversation> {
    const user = req.user;
    if (!user) {
        throw new Error("User not authenticated");
    }

    // Validate conversation options (e.g., title, model, etc.)
    const { title, model } = req.body;
    // TODO: Zod validation for title and model can be added here
    if (!title || !model) {
        throw new Error("Invalid conversation options");
    }
    // validate model
    const modelData = await prisma.model.findUnique({
        where: {
            model_name: model
        },
        select: {
            id: true
        }
    })
    if (!modelData) {
        throw new Error("Invalid model");
    }
    const newConversation = await prisma.conversation.create({
        data: {
            user_id: user.id,
            title: title,
            model_id: modelData.id,
        }
    })

    if(!newConversation) {
        throw new Error("Failed to create conversation");
    }

    return newConversation;

}

export async function getConversationMessages(req: Request): Promise<Message[]> {
    const user = req.user;
    
    const { conversationId } = req.params;
    // TODO: Zod validation
    if(!conversationId || typeof conversationId !== 'string') {
        throw new Error("Conversation ID is required");
    }
    const conversation = await prisma.conversation.findUnique({
        where: {
            id: conversationId
        }
    })
    if(!conversation) {
        throw new Error("Conversation not found");
    }
    if(conversation.user_id !== user?.id) {
        throw new Error("User does not own this conversation");
    }
    const conversationMessages = await prisma.message.findMany({
        where: {
            conversation_id: conversation.id,
            user_id: user?.id
        },
        orderBy: {
            createdAt: 'asc'
        }
    })

    if(!conversationMessages) {
        throw new Error("No messages found for this conversation");
    }

    return conversationMessages;
}

export async function renameConversationRecord(req: Request): Promise<Conversation> {
    const user = req.user;
    const { conversationId } = req.params;
    const { title } = req.body;

    if(!conversationId || typeof conversationId !== 'string') {
        throw new Error("Conversation ID is required");
    }
    if(!title?.trim() || typeof title !== 'string') {
        throw new Error("Title is required");
    }

    const conversation = await prisma.conversation.findUnique({
        where: {
            id: conversationId
        }
    })
    if(!conversation) {
        throw new Error("Conversation not found");
    }
    if(conversation.user_id !== user?.id) {
        throw new Error("User does not own this conversation");
    }

    const updatedConversation = await prisma.conversation.update({
        where: {
            id: conversationId
        },
        data: {
            title: title.trim()
        }
    })

    return updatedConversation;
}

export async function deleteConversationRecord(req: Request): Promise<void> {
    const user = req.user;
    const { conversationId } = req.params;
    
    if(!conversationId || typeof conversationId !== 'string') {
        throw new Error("Conversation ID is required");
    }
    const conversation = await prisma.conversation.findUnique({
        where: {
            id: conversationId
        }
    })
    if(!conversation) {
        throw new Error("Conversation not found");
    }
    if(conversation.user_id !== user?.id) {
        throw new Error("User does not own this conversation");
    }
    await prisma.conversation.delete({
        where: {
            id: conversationId
        }
    })
}

export async function sendConversationMessage(req: Request): Promise<void> {
    // TODO: Confirm ownership, persist the user message, request an AI response, stream it to the client, and persist the completed response.
}
