import { Request, Response } from "express";
import {
    createConversationRecord,
    deleteConversationRecord,
    getConversationMessages as loadConversationMessages,
    getUserConversations,
    renameConversationRecord,
    sendConversationMessage
} from "./conversation.services.js";
export async function getConversations(req: Request, res: Response): Promise<void> {
    try {
        const conversations = await getUserConversations(req);
        res.status(200).json({
            message: "Conversations retrieved successfully",
            data: conversations
        });
    } catch (error: any) {
        res.status(500).json({
            message: "Failed to retrieve conversations",
            error: error.message
        });
    }
}

export async function createConversation(req: Request, res: Response): Promise<void> {
    try {
        const conversation = await createConversationRecord(req);
        res.status(201).json({
            message: "Conversation created successfully",
            data: conversation
        });
    } catch (error: any) {
        res.status(500).json({
            message: "Failed to create conversation",
            error: error.message
        });
    }
}

export async function getConversationMessages(req: Request, res: Response): Promise<void> {
    try {
        const messages = await loadConversationMessages(req);
        res.status(200).json({
            message: "Conversation messages retrieved successfully",
            data: messages
        });
    } catch (error: any) {
        res.status(500).json({
            message: "Failed to retrieve conversation messages",
            error: error.message
        });
    }
}

export async function updateConversation(req: Request, res: Response): Promise<void> {
    try {
        const conversation = await renameConversationRecord(req);
        res.status(200).json({
            message: "Conversation updated successfully",
            data: conversation
        });
    } catch (error: any) {
        res.status(500).json({
            message: "Failed to update conversation",
            error: error.message
        });
    }
}

export async function deleteConversation(req: Request, res: Response): Promise<void> {
    try {
        await deleteConversationRecord(req);
        res.status(200).json({ message: "Conversation deleted successfully" });
    } catch (error: any) {
        res.status(500).json({
            message: "Failed to delete conversation",
            error: error.message
        });
    }
}

export async function sendMessage(req: Request, res: Response): Promise<void> {
    try {
        await sendConversationMessage(req);
        res.status(200).json({ message: "Message sent successfully" });
    } catch (error: any) {
        res.status(500).json({
            message: "Failed to send message",
            error: error.message
        });
    }
}
