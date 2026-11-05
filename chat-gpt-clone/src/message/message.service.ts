import {prisma} from '../lib/prisma.js';

type MessageRole = "USER" | "ASSISTANT" | "SYSTEM";

export type MessageItem = {
    id: string;
    conversation_id: string;
    role: MessageRole;
    status: "PENDING" | "COMPLETE" | "ERROR";
    content: string;
    createdAt: Date;
    updatedAt: Date;
};


async function assertOwnsConversation(conversationId: string, userId: string) {
    const conversation = await prisma.conversation.findFirst({
        where: { id: conversationId, user_id: userId },
    });

    if (!conversation) {
        throw new Error("Conversation not found");
    }

    return conversation;
}

/** Load messages for a conversation (oldest → newest). */
export async function listMessages(
    conversationId: string,
    userId: string
  ): Promise<MessageItem[]> {
    
    await assertOwnsConversation(conversationId, userId);
  
    return await prisma.message.findMany({
      where: { conversation_id: conversationId },
      orderBy: { createdAt: "asc" },
      select: {
        id: true,
        conversation_id: true,
        role: true,
        status: true,
        content: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }
  
  /**
   * Create a user message in a conversation.
   * No AI reply yet — this only persists the user's text.
   * Optionally renames "New Chat" using the first message.
   */
  export async function createMessage(conversationId: string, content: string, userId: string) {
    
    const conversation = await assertOwnsConversation(conversationId, userId);
  
    const trimmed = content.trim();
    if (!trimmed) {
      throw new Error("Message cannot be empty");
    }
  
    const message = await prisma.message.create({
      data: {
        conversation_id: conversationId,
        role: "USER",
        status: "COMPLETE",
        content: trimmed,
        model_id: conversation.model_id,
        token_used: 0,
      },
    });
  
    const shouldRename =
      conversation.title === "New Chat" || conversation.title.trim() === "";
  
    await prisma.conversation.update({
      where: { id: conversationId },
      data: {
        // lastMessageAt: new Date(),
        ...(shouldRename
          ? {
              title:
                trimmed.length > 48 ? `${trimmed.slice(0, 48)}…` : trimmed,
            }
          : {}),
      },
    });
  
    return message;
  }
  
  /** Update message text (e.g. edit). */
  export async function updateMessage(messageId: string, content: string, userId: string) {
    
    const trimmed = content.trim();
  
    if (!trimmed) {
      throw new Error("Message cannot be empty");
    }
  
    const existing = await prisma.message.findUnique({
      where: { id: messageId },
      include: { conversation: true },
    });
  
    if (!existing || existing.conversation.user_id !== userId) {
      throw new Error("Message not found");
    }
  
    const message = await prisma.message.update({
      where: { id: messageId },
      data: { content: trimmed },
    });
  
    return message;
  }
  
  /** Delete a single message. */
  export async function deleteMessage(messageId: string, userId: string) {
  
    const existing = await prisma.message.findUnique({
      where: { id: messageId },
      include: { conversation: true },
    });
  
    if (!existing || existing.conversation.user_id !== userId) {
      throw new Error("Message not found or unser is not owner of the conversation");
    }
  
    await prisma.message.delete({ where: { id: messageId } });
  
    
    return { id: messageId, conversation_id: existing.conversation_id };
  }