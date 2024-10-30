'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';

export default function EventChat({ eventId }: { eventId: string }) {
  const { user } = useUser();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  // Implement real-time chat using WebSocket or similar
}