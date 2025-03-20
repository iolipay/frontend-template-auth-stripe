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
  SparklesIcon,
  ArrowPathIcon,
  ChatBubbleLeftRightIcon,
  UserIcon,
} from "@heroicons/react/24/outline";

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
    <div className="flex h-[calc(100vh-120px)] bg-black text-white">
      {/* Sidebar */}
      <div className="w-72 bg-black border-r border-white flex flex-col">
        <div className="p-4 border-b border-white">
          <button
            onClick={createNewChat}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-md bg-white text-black font-medium transition-all duration-200 shadow-lg hover:shadow-md"
          >
            <PlusIcon className="w-5 h-5" />
            <span>New Conversation</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3 scrollbar-thin scrollbar-thumb-white scrollbar-track-transparent">
          {chats.length === 0 ? (
            <div className="text-center text-white p-6 flex flex-col items-center">
              <ChatBubbleLeftRightIcon className="w-10 h-10 mb-2 opacity-50" />
              <p>No conversations yet</p>
            </div>
          ) : (
            <ul className="space-y-2">
              {chats.map((chat) => (
                <li key={chat.id}>
                  <Link
                    href={`/dashboard/chat?id=${chat.id}`}
                    className={`flex items-center justify-between p-3 rounded-lg hover:bg-white hover:text-black transition-all duration-200 ${
                      currentChat?.id === chat.id
                        ? "bg-white text-black border-l-4 border-black"
                        : "text-white"
                    }`}
                  >
                    <div className="truncate flex-1 font-medium">
                      {chat.title || "New Conversation"}
                    </div>
                    <button
                      onClick={(e) => deleteChat(chat.id, e)}
                      className="text-white hover:text-red-400 transition-colors p-1 rounded-full hover:bg-black"
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
      <div className="flex-1 flex flex-col bg-black relative">
        {/* Messages */}
        <div className="flex-1 overflow-hidden p-6 scrollbar-thin scrollbar-thumb-white scrollbar-track-transparent">
          <div className="max-h-[calc(100vh-120px)] overflow-y-auto">
            {loading ? (
              <div className="flex justify-center items-center h-full">
                <ArrowPathIcon className="w-8 h-8 text-white animate-spin" />
              </div>
            ) : messages.length === 0 && !streamingMessage ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-6">
                <div className="w-16 h-16 mb-4 rounded-full bg-white flex items-center justify-center">
                  <SparklesIcon className="w-8 h-8 text-black" />
                </div>
                <h2 className="text-2xl font-bold mb-3 text-white">
                  Start a new conversation
                </h2>
                <p className="text-white max-w-md">
                  Ask anything or start a conversation with the AI assistant.
                </p>
              </div>
            ) : (
              <div className="space-y-6 max-w-4xl mx-auto">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      msg.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    {msg.role === "assistant" && (
                      <div className="mr-2">
                        <UserIcon className="w-6 h-6 text-white" />
                      </div>
                    )}
                    <div
                      className={`max-w-3xl p-4 rounded-2xl shadow-lg ${
                        msg.role === "user"
                          ? "bg-white text-black"
                          : "bg-black border border-white"
                      }`}
                    >
                      <div className="whitespace-pre-wrap leading-relaxed">
                        {msg.content}
                      </div>
                    </div>
                  </div>
                ))}

                {streamingMessage && (
                  <div className="flex justify-start">
                    <div className="max-w-3xl p-4 rounded-2xl shadow-lg bg-black border border-white">
                      <div className="whitespace-pre-wrap leading-relaxed">
                        {streamingMessage}
                        <span className="inline-block w-2 h-4 ml-1 bg-white animate-pulse"></span>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
          {/* Fade effect for long chats */}
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black to-transparent"></div>
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-white bg-black">
          <form
            onSubmit={handleSubmit}
            className="flex items-end gap-3 max-w-4xl mx-auto"
          >
            <div className="flex-1 bg-white rounded-xl border border-black overflow-hidden shadow-inner focus-within:border-black transition-all duration-200">
              <textarea
                ref={textareaRef}
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                  adjustTextareaHeight();
                }}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                className="w-full p-4 focus:outline-none resize-none bg-white text-black max-h-40"
                rows={1}
                disabled={isStreaming}
              />
            </div>
            <button
              type="submit"
              disabled={isStreaming || !message.trim()}
              className="p-4 bg-black text-white rounded-xl hover:bg-gray-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              <PaperAirplaneIcon className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
