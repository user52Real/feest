import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import clientPromise from '../../lib/mongodb';
import { Event } from '@/app/types/events';

export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const data = await req.json();
    const client = await clientPromise;
    const db = client.db('feest');

    // Validate required fields
    if (!data.title || !data.date || !data.time) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Handle event capacity
    let guestList = data.guests || [];
    let waitlist: typeof guestList = [];
    
    if (data.capacity && guestList.length > data.capacity) {
      waitlist = guestList.slice(data.capacity);
      guestList = guestList.slice(0, data.capacity);
    }

    const event = {
      ...data,
      userId,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'active',
      isTemplate: data.template || false,
      category: data.category || 'Other',
      tags: data.tags || [],
      isPublic: data.isPublic || false,
      capacity: data.capacity || null,
      guests: guestList.map((email: string) => ({
        email,
        status: 'pending',
        invitedAt: new Date(),
        name: ''
      })),
      waitlist: waitlist.map((email: string) => ({
        email,
        status: 'waitlisted',
        invitedAt: new Date(),
        name: ''
      }))
    };

    // Handle recurring events
    if (data.recurrence) {
      const recurringEvents = generateRecurringEvents(event, data.recurrence);
      const result = await db.collection('events').insertMany(recurringEvents);
      return NextResponse.json(
        { ids: result.insertedIds },
        { status: 201 }
      );
    }

    const result = await db.collection('events').insertOne(event);

    return NextResponse.json(
      { id: result.insertedId },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const { userId } = await auth();
    const { searchParams } = new URL(req.url);

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const client = await clientPromise;
    const db = client.db('feest');

    // Build query based on filters
    const query: any = { userId };

    // Category filter
    const category = searchParams.get('category');
    if (category && category !== 'all') {
      query.category = category;
    }

    // Tags filter
    const tags = searchParams.get('tags')?.split(',');
    if (tags && tags.length > 0) {
      query.tags = { $in: tags };
    }

    // Template filter
    const templates = searchParams.get('templates');
    if (templates === 'true') {
      query.isTemplate = true;
    }

    // Privacy filter
    const privacy = searchParams.get('privacy');
    if (privacy) {
      query.isPublic = privacy === 'public';
    }

    const events = await db
      .collection('events')
      .find(query)
      .sort({ date: 1, time: 1 })
      .toArray();

    return NextResponse.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

function generateRecurringEvents(baseEvent: any, recurrence: any) {
  const events = [];
  let currentDate = new Date(baseEvent.date);
  const endDate = new Date(recurrence.endDate);

  while (currentDate <= endDate) {
    // For weekly recurrence, check if the day is included
    if (recurrence.frequency === 'weekly' && recurrence.daysOfWeek) {
      if (!recurrence.daysOfWeek.includes(currentDate.getDay())) {
        currentDate.setDate(currentDate.getDate() + 1);
        continue;
      }
    }

    events.push({
      ...baseEvent,
      date: new Date(currentDate),
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Increment date based on frequency
    switch (recurrence.frequency) {
      case 'daily':
        currentDate.setDate(currentDate.getDate() + recurrence.interval);
        break;
      case 'weekly':
        currentDate.setDate(currentDate.getDate() + (7 * recurrence.interval));
        break;
      case 'monthly':
        currentDate.setMonth(currentDate.getMonth() + recurrence.interval);
        break;
      case 'yearly':
        currentDate.setFullYear(currentDate.getFullYear() + recurrence.interval);
        break;
    }
  }

  return events;
}