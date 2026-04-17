"use client";

import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";

export default function ContactMessagesAdmin() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const res = await fetch("/api/contact");
      const data = await res.json();
      setMessages(data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteMessage = async (id) => {
    if (confirm("Delete this message?")) {
      try {
        await fetch(`/api/contact/${id}`, { method: "DELETE" });
        fetchMessages();
      } catch (error) {
        console.error("Error deleting message:", error);
      }
    }
  };

  if (loading) return <div className="text-center py-12">Loading...</div>;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Contact Messages</h1>
        <p className="text-gray-600 mt-2">{messages.length} total messages</p>
      </div>

      {messages.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-500">No messages yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{message.subject}</h3>
                  <p className="text-sm text-gray-600 mt-1">From: {message.name} ({message.email})</p>
                  {message.phone && <p className="text-sm text-gray-600">Phone: {message.phone}</p>}
                </div>
                <button
                  onClick={() => deleteMessage(message.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 size={20} />
                </button>
              </div>
              <p className="text-gray-700 mb-4">{message.message}</p>
              <p className="text-xs text-gray-500">
                {new Date(message.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
