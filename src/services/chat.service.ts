import { apiFetch, apiStreamFetch } from "@/utils/api";

export interface Message {
  role: "user" | "assistant" | "system";
  content: string;
  created_at?: string;
}

export interface Chat {
  id: string;
  user_id: string;
  title: string | null;
  messages: Message[];
  created_at: string;
  updated_at: string;
}

export interface ChatListItem {
  id: string;
  user_id: string;
  title: string | null;
  last_message: Message | null;
  created_at: string;
  updated_at: string;
}

export class ChatService {
  static async createChat(
    title?: string,
    messages: Message[] = []
  ): Promise<Chat> {
    const response = await apiFetch("/chat/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        messages,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to create chat");
    }

    return response.json();
  }

  static async getChats(skip = 0, limit = 20): Promise<ChatListItem[]> {
    const response = await apiFetch(`/chat/?skip=${skip}&limit=${limit}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch chats: ${response.status}`);
    }

    return response.json();
  }

  static async getChat(chatId: string): Promise<Chat> {
    const response = await apiFetch(`/chat/${chatId}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch chat: ${response.status}`);
    }

    return response.json();
  }

  static async deleteChat(chatId: string): Promise<void> {
    const response = await apiFetch(`/chat/${chatId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`Failed to delete chat: ${response.status}`);
    }
  }

  static async updateChat(chatId: string, title: string): Promise<Chat> {
    const response = await apiFetch(`/chat/${chatId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to update chat: ${response.status}`);
    }

    return response.json();
  }

  static async streamChat(
    message: string,
    chatId?: string
  ): Promise<ReadableStream<Uint8Array> | null> {
    return apiStreamFetch("/chat/stream", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message,
        chat_id: chatId,
      }),
    });
  }
}
