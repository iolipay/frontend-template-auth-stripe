import { AuthService } from "./auth.service";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

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
    const response = await fetch(`${API_URL}/chat/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${AuthService.getToken()}`,
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
    const response = await fetch(
      `${API_URL}/chat/?skip=${skip}&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${AuthService.getToken()}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch chats");
    }

    return response.json();
  }

  static async getChat(chatId: string): Promise<Chat> {
    const response = await fetch(`${API_URL}/chat/${chatId}`, {
      headers: {
        Authorization: `Bearer ${AuthService.getToken()}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch chat");
    }

    return response.json();
  }

  static async deleteChat(chatId: string): Promise<void> {
    const response = await fetch(`${API_URL}/chat/${chatId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${AuthService.getToken()}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to delete chat");
    }
  }

  static async updateChat(chatId: string, title: string): Promise<Chat> {
    const response = await fetch(`${API_URL}/chat/${chatId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${AuthService.getToken()}`,
      },
      body: JSON.stringify({
        title,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to update chat");
    }

    return response.json();
  }

  static async streamChat(
    message: string,
    chatId?: string
  ): Promise<ReadableStream<Uint8Array> | null> {
    const response = await fetch(`${API_URL}/chat/stream`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${AuthService.getToken()}`,
      },
      body: JSON.stringify({
        message,
        chat_id: chatId,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to stream chat");
    }

    return response.body;
  }
}
