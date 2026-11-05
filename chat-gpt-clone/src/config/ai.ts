import { google } from "@ai-sdk/google"

const DEFAULT_CHAT_MODEL = "gemini-4-argon"

export function getChatModel(modelId?: string | null) {
    return google(modelId || DEFAULT_CHAT_MODEL)
}