// src/app/components/GuestChat.tsx
'use client';

import { useEffect, useState, useRef } from 'react';
import { Event, Guest, GUEST_ROLES } from '../types/events';

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: Date;
  isSystemMessage?: boolean;
}

interface GuestChatProps {
  eventId: string;
  eventTitle: string;
  currentUserEmail: string;
  guestRole?: {
    coHosts?: string[];
    moderators?: string[];
  };
}

export default function GuestChat({ eventId, eventTitle, currentUserEmail, guestRole }: GuestChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<'all' | string>('all');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Here you would typically set up WebSocket connection
    // and load previous messages
    const loadMessages = async () => {
      try {
        const response = await fetch(`/api/events/${eventId}/messages`);
        if (response.ok) {
          const data = await response.json();
          setMessages(data);
        }
      } catch (error) {
        console.error('Error loading messages:', error);
      }
    };

    loadMessages();
  }, [eventId]);

  const canMessageAll = guestRole && 
    (guestRole.coHosts?.includes(currentUserEmail) || 
     guestRole.moderators?.includes(currentUserEmail));

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      sender: currentUserEmail,
      content: newMessage,
      timestamp: new Date()
    };

    try {
      const response = await fetch(`/api/events/${eventId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          group: selectedGroup
        }),
      });

      if (response.ok) {
        setMessages(prev => [...prev, message]);
        setNewMessage('');
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="flex flex-col h-[400px] bg-white rounded-lg shadow">
      {/* Chat Header */}
      <div className="p-4 border-b">
        <h3 className="text-lg font-medium text-gray-900">{eventTitle}</h3>
        {canMessageAll && (
          <select
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
            className="mt-2 block w-full rounded-md border-gray-300 text-black"
          >
            <option value="all">All Guests</option>
            <option value="co-hosts">Co-Hosts</option>
            <option value="moderators">Moderators</option>
          </select>
        )}
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-black">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.sender === currentUserEmail ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-xs px-4 py-2 rounded-lg ${
                message.sender === currentUserEmail
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              {message.isSystemMessage ? (
                <p className="text-sm text-black italic ">{message.content}</p>
              ) : (
                <>
                  <p className="text-xs opacity-75 text-black">{message.sender}</p>
                  <p>{message.content}</p>
                  <p className="text-xs opacity-75 text-black">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </p>
                </>
              )}
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Message Input */}
      <form onSubmit={handleSendMessage} className="p-4 border-t">
        <div className="flex space-x-2 mb-10">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 rounded-md border-gray-300 text-black"
          />          
        </div>
        <button
            type="submit"
            disabled={!newMessage.trim()}
            className="flex px-2 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 item-center justify-center w-full"
        >
            Send
        </button>
        
      </form>
    </div>
  );
}