import clientPromise from '@/app/lib/mongodb';
import { Event } from '@/app/types/events';
import { ObjectId } from 'mongodb';

export async function getEvent(eventId: string): Promise<Event | null> {
  try {
    const client = await clientPromise;
    const db = client.db('feest');
    
    const event = await db
      .collection('events')
      .findOne({ _id: new ObjectId(eventId) });

    if (!event) return null;

    return {
      ...event,
      _id: event._id.toString(),
      createdAt: new Date(event.createdAt),
      updatedAt: new Date(event.updatedAt),
      date: new Date(event.date),
      guests: event.guests?.map((guest: any) => ({
        ...guest,
        invitedAt: new Date(guest.invitedAt),
        respondedAt: guest.respondedAt ? new Date(guest.respondedAt) : undefined,
        status: guest.status || 'pending'
      })) || []
    } as Event;
  } catch (error) {
    console.error('Error fetching event:', error);
    return null;
  }
}