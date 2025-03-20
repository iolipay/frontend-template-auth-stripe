"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ChatService,
  Message,
  Chat,
  ChatListItem,
} from "@/services/chat.service";
import Link from "next/link";
import {
  PaperAirplaneIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { AuthService } from "@/services/auth.service";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function ChatPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const chatId = searchParams.get("id");

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [chats, setChats] = useState<ChatListItem[]>([]);
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [loading, setLoading] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Load chats
  useEffect(() => {
    loadChats();
  }, []);

  // Load specific chat if ID is provided
  useEffect(() => {
    if (chatId) {
      loadChat(chatId);
    } else {
      setCurrentChat(null);
      setMessages([]);
    }
  }, [chatId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingMessage]);

  const loadChats = async () => {
    try {
      const chatList = await ChatService.getChats();
      setChats(chatList);
    } catch (error) {
      console.error("Failed to load chats:", error);
    }
  };

  const loadChat = async (id: string) => {
    try {
      setLoading(true);
      const chat = await ChatService.getChat(id);
      setCurrentChat(chat);
      setMessages(chat.messages);
    } catch (error) {
      console.error("Failed to load chat:", error);
    } finally {
      setLoading(false);
    }
  };

  const createNewChat = async () => {
    router.push("/dashboard/chat");
  };

  const deleteChat = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!confirm("Are you sure you want to delete this chat?")) return;

    try {
      await ChatService.deleteChat(id);
      setChats(chats.filter((chat) => chat.id !== id));
      if (currentChat?.id === id) {
        router.push("/dashboard/chat");
      }
    } catch (error) {
      console.error("Failed to delete chat:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim()) return;

    // Add user message to the UI immediately
    const userMessage: Message = {
      role: "user",
      content: message,
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setMessage("");

    try {
      setIsStreaming(true);
      setStreamingMessage("");

      // Use the service method instead of direct fetch
      const stream = await ChatService.streamChat(message, currentChat?.id);

      if (!stream) {
        throw new Error("Failed to get stream");
      }

      const reader = stream.getReader();

      const decoder = new TextDecoder();
      let done = false;
      let accumulatedResponse = "";

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;

        if (value) {
          const chunk = decoder.decode(value);

          // Process the SSE data format
          const lines = chunk.split("\n").filter((line) => line.trim() !== "");

          for (const line of lines) {
            if (line.startsWith("data:")) {
              try {
                const jsonStr = line.slice(5).trim();
                const data = JSON.parse(jsonStr);

                if (data.text) {
                  accumulatedResponse += data.text;
                  setStreamingMessage(accumulatedResponse);
                }
              } catch (error) {
                console.error("Error parsing SSE data:", error);
              }
            }
          }
        }
      }

      // After streaming is complete, add the assistant message
      const assistantMessage: Message = {
        role: "assistant",
        content: accumulatedResponse,
        created_at: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setStreamingMessage("");

      // If this is a new chat, reload the chat list
      if (!currentChat) {
        loadChats();
      }
    } catch (error) {
      console.error("Error streaming chat:", error);
    } finally {
      setIsStreaming(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  return (
    <div className="flex h-[calc(100vh-120px)]">
      {/* Sidebar */}
      <div className="w-64 bg-white dark:bg-black/20 border-r border-black/[.08] dark:border-white/[.1] flex flex-col">
        <div className="p-4 border-b border-black/[.08] dark:border-white/[.1]">
          <button
            onClick={createNewChat}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-md border border-black/[.08] dark:border-white/[.145] hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] transition-colors"
          >
            <PlusIcon className="w-5 h-5" />
            <span>New Chat</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {chats.length === 0 ? (
            <div className="text-center text-gray-500 dark:text-gray-400 p-4">
              No chats yet
            </div>
          ) : (
            <ul className="space-y-1">
              {chats.map((chat) => (
                <li key={chat.id}>
                  <Link
                    href={`/dashboard/chat?id=${chat.id}`}
                    className={`flex items-center justify-between p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 ${
                      currentChat?.id === chat.id
                        ? "bg-gray-100 dark:bg-gray-800"
                        : ""
                    }`}
                  >
                    <div className="truncate flex-1">
                      {chat.title || "New Chat"}
                    </div>
                    <button
                      onClick={(e) => deleteChat(chat.id, e)}
                      className="text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-gray-50 dark:bg-gray-900">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
            </div>
          ) : messages.length === 0 && !streamingMessage ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <h2 className="text-xl font-semibold mb-2">
                Start a new conversation
              </h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-md">
                Ask a question or start a conversation with the AI assistant.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-3xl p-3 rounded-lg ${
                      msg.role === "user"
                        ? "bg-blue-500 text-white"
                        : "bg-white dark:bg-gray-800 border border-black/[.08] dark:border-white/[.1]"
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{msg.content}</div>
                  </div>
                </div>
              ))}

              {streamingMessage && (
                <div className="flex justify-start">
                  <div className="max-w-3xl p-3 rounded-lg bg-white dark:bg-gray-800 border border-black/[.08] dark:border-white/[.1]">
                    <div className="whitespace-pre-wrap">
                      {streamingMessage}
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-black/[.08] dark:border-white/[.1]">
          <form onSubmit={handleSubmit} className="flex items-end gap-2">
            <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg border border-black/[.08] dark:border-white/[.1] overflow-hidden">
              <textarea
                ref={textareaRef}
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                  adjustTextareaHeight();
                }}
                onKeyDown={handleKeyDown}
                placeholder="Type a message..."
                className="w-full p-3 focus:outline-none resize-none dark:bg-gray-800 max-h-32"
                rows={1}
                disabled={isStreaming}
              />
            </div>
            <button
              type="submit"
              disabled={isStreaming || !message.trim()}
              className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <PaperAirplaneIcon className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
