import { apiFetch, apiStreamFetch } from "@/utils/api";
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
  private static handleUnauthorized() {
    // Clear auth data
    AuthService.logout();

    // Redirect to login page
    if (typeof window !== "undefined") {
      window.location.href = "/auth/login";
    }
  }

  private static async handleResponse(response: Response) {
    if (response.status === 401) {
      ChatService.handleUnauthorized();
      throw new Error("Unauthorized - Please log in again");
    }

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    return response;
  }

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
    const response = await fetch(
      `${API_URL}/chat/?skip=${skip}&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${AuthService.getToken()}`,
        },
      }
    );

    await ChatService.handleResponse(response);
    return response.json();
  }

  static async getChat(chatId: string): Promise<Chat> {
    const response = await fetch(`${API_URL}/chat/${chatId}`, {
      headers: {
        Authorization: `Bearer ${AuthService.getToken()}`,
      },
    });

    await ChatService.handleResponse(response);
    return response.json();
  }

  static async deleteChat(chatId: string): Promise<void> {
    const response = await fetch(`${API_URL}/chat/${chatId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${AuthService.getToken()}`,
      },
    });

    await ChatService.handleResponse(response);
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

    await ChatService.handleResponse(response);
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
