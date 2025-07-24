"use client";

import { useState, useEffect, useRef } from "react";
import { ChatMessage } from "@/lib/socket";

interface ChatProps {
  studentName?: string;
  isTeacher?: boolean;
  onSendMessage?: (message: string) => void;
  messages?: ChatMessage[];
}

export default function Chat({
  studentName,
  isTeacher = false,
  onSendMessage,
  messages = [],
}: ChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !onSendMessage) return;

    onSendMessage(message.trim());
    setMessage("");
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 bg-indigo-600 text-white p-3 rounded-full shadow-lg hover:bg-indigo-700 transition-colors z-50"
      >
        {isOpen ? "✕" : "💬"}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 w-80 h-96 bg-white rounded-lg shadow-xl border border-gray-200 flex flex-col z-50">
          {/* Chat Header */}
          <div className="bg-indigo-600 text-white p-3 rounded-t-lg">
            <h3 className="font-semibold">
              {isTeacher ? "Teacher Chat" : "Student Chat"}
            </h3>
            <p className="text-sm opacity-90">
              {isTeacher ? "Chat with students" : `Chatting as ${studentName}`}
            </p>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 text-sm py-8">
                No messages yet. Start the conversation!
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.isTeacher ? "justify-start" : "justify-end"
                  }`}
                >
                  <div
                    className={`max-w-xs p-2 rounded-lg text-sm ${
                      msg.isTeacher
                        ? "bg-gray-100 text-gray-800"
                        : "bg-indigo-600 text-white"
                    }`}
                  >
                    <div className="font-medium text-xs mb-1">{msg.sender}</div>
                    <div>{msg.message}</div>
                    <div
                      className={`text-xs mt-1 ${
                        msg.isTeacher ? "text-gray-500" : "text-indigo-200"
                      }`}
                    >
                      {formatTime(msg.timestamp)}
                    </div>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <form
            onSubmit={handleSendMessage}
            className="p-3 border-t border-gray-200"
          >
            <div className="flex space-x-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                disabled={!onSendMessage}
              />
              <button
                type="submit"
                disabled={!message.trim() || !onSendMessage}
                className="px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm"
              >
                Send
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
