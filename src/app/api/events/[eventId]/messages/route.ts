import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import clientPromise from '@/app/lib/mongodb';
import { ObjectId } from 'mongodb';
import { validateAndSanitizeMessage } from '@/app/lib/security/sanitize';
import { ApiError, handleApiError } from '@/app/lib/errors/ApiError';

export async function GET(
  request: Request,
  { params }: { params: { eventId: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const eventId = params.eventId;

    const client = await clientPromise;
    const db = client.db('feest');

    // Verify user has access to this event
    const event = await db.collection('events').findOne({
      _id: new ObjectId(params.eventId),
      $or: [
        { userId },
        { 'guests.email': userId },
        { 'guestRoles.coHosts': userId },
        { 'guestRoles.moderators': userId }
      ]
    });

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    const messages = await db
      .collection('event_messages')
      .find({ eventId: new ObjectId(params.eventId) })
      .sort({ timestamp: 1 })
      .toArray();

    return NextResponse.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: { eventId: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const eventId = params.eventId;

    const { content, group = 'all' } = await request.json();

    const client = await clientPromise;
    const db = client.db('feest');

    // Verify user has access to this event
    const event = await db.collection('events').findOne({
      _id: new ObjectId(params.eventId),
      $or: [
        { userId },
        { 'guests.email': userId },
        { 'guestRoles.coHosts': userId },
        { 'guestRoles.moderators': userId }
      ]
    });

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    

    const message = {
      eventId: new ObjectId(params.eventId),
      senderId: userId,
      content,
      group,
      timestamp: new Date()
    };

    await db.collection('event_messages').insertOne(message);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}