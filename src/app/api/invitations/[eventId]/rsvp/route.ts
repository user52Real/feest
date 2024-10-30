// src/app/api/invitations/[eventId]/rsvp/route.ts
import { NextResponse } from 'next/server';
import clientPromise from '@/app/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(
  request: Request,
  { params }: { params: { eventId: string } }
) {
  try {
    const { email, response } = await request.json();

    const client = await clientPromise;
    const db = client.db('feest');

    const result = await db.collection('events').updateOne(
      {
        _id: new ObjectId(params.eventId),
        'guests.email': email
      },
      {
        $set: {
          'guests.$.status': response,
          'guests.$.respondedAt': new Date()
        }
      }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { error: 'Invitation not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating RSVP:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}