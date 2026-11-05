import { Request, Response } from "express";
import { createMessage } from "./message.service.js";
import { chatLLM } from "../api/chat.js";
import { pipeUIMessageStreamToResponse, toUIMessageStream } from "ai";

export async function sendMessage(req: Request, res: Response) {
    try {
        const  {convId }  = req.params;

        if(!convId ) {
            return res.status(400).json({ error: "Missing required parameter: conversation_id is required." });
        }
        const message = req.body?.message;

        if (typeof message?.content !== "string" || !message.content.trim()) {
            return res.status(400).json({ error: "A non-empty message.content is required." });
        }
        if (!req.user?.id) {
            return res.status(401).json({ error: "Authentication required." });
        }
        await createMessage(convId as string, message.content, req.user.id);

        const result = await chatLLM(req, convId as string);

        /**
         * The pipeUIMessageStreamToResponse function pipes streaming data to a Node.js ServerResponse object
         * https://ai-sdk.dev/docs/reference/ai-sdk-ui/pipe-ui-message-stream-to-response
         */
        await pipeUIMessageStreamToResponse({
            response: res,
            stream: toUIMessageStream({ stream: result.stream }),
        });

    } catch (error: any) {
        const status = error.message === "Conversation not found" || error.message.includes("not found") ? 404 : 500;
        return res.status(status).json({ error: `Error in sendMessage: ${error.message}` });
    }
} 
