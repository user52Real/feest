// src/app/api/invitations/route.ts
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import clientPromise from '@/app/lib/mongodb';
import { Event, Guest } from '@/app/types/events';
import { ObjectId } from 'mongodb';
import { Resend } from 'resend';
import { emailTemplates } from '@/app/lib/email/templates';
import { Document, UpdateFilter } from 'mongodb';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { eventId, guests } = await req.json();

    const client = await clientPromise;
    const db = client.db('feest');

    // Get event details
    const event = await db.collection('events').findOne({
      _id: new ObjectId(eventId),
      userId
    });

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    // Create guest objects with proper typing
    const updatedGuests: Guest[] = guests.map((email: string) => ({
      email,
      name: '',
      status: 'pending' as const,
      invitedAt: new Date(),
    }));

    // Update event with new guests using correct MongoDB update syntax
    const updateResult = await db.collection('events').updateOne(
      { _id: new ObjectId(eventId) },
      { 
        $push: { 
          guests: {
            $each: updatedGuests
          } 
        } as UpdateFilter<Document>
      } 
    );

    if (!updateResult.modifiedCount) {
      return NextResponse.json(
        { error: 'Failed to update event' },
        { status: 500 }
      );
    }

    // Convert MongoDB document to Event type for email sending
    const eventForEmail: Event = {
      ...event,
      _id: event._id.toString(),
      guests: event.guests || [],
      createdAt: new Date(event.createdAt),
      updatedAt: new Date(event.updatedAt),
      date: new Date(event.date)
    } as Event;

    // Send invitation emails using Resend
    const emailPromises = updatedGuests.map(guest => 
      resend.emails.send({
        from: process.env.EMAIL_FROM || 'events@yourdomain.com',
        to: guest.email,
        subject: `You're invited to ${event.title}!`,
        html: emailTemplates.eventInvitation(eventForEmail, guest)
      })
    );

    await Promise.all(emailPromises);

    return NextResponse.json({ 
      success: true,
      message: `Successfully invited ${updatedGuests.length} guests`
    });
  } catch (error) {
    console.error('Error sending invitations:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}