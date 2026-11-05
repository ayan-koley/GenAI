import { google } from "@ai-sdk/google"

const DEFAULT_CHAT_MODEL = "gemini-3.6-flash"

export function getChatModel(modelId?: string | null) {
    return google(DEFAULT_CHAT_MODEL)
    
}