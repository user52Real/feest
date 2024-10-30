import { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import clientPromise from '@/app/lib/mongodb';
import { ObjectId } from 'mongodb';

type RouteContext = {
  params: {
    eventId: string;
  }
}

export async function GET(
  req: NextRequest,
  context: RouteContext
) {
  const { params } = context;
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db('feest');

    const event = await db.collection('events').findOne({
      _id: new ObjectId(context.params.eventId),
      userId
    });

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    return NextResponse.json(event.guests || []);
  } catch (error) {
    console.error('Error fetching guests:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();

    if (!Array.isArray(data.guests)) {
      return NextResponse.json(
        { error: 'Invalid guests data format' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('feest');

    const result = await db.collection('events').updateOne(
      { _id: new ObjectId(context.params.eventId), userId },
      {
        $set: {
          guests: data.guests,
          updatedAt: new Date()
        }
      }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { error: 'Failed to update guests' },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating guests:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}