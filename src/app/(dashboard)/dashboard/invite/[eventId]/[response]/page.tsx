import { redirect } from 'next/navigation';
import { ObjectId } from 'mongodb';
import clientPromise from '@/app/lib/mongodb';

interface RSVPPageProps {
  params: Promise<{
    eventId: string;
    response: 'accept' | 'decline';
    email: string;
  }>;
}

export default async function RSVPPage({ params }: RSVPPageProps) {
  // Await the params
  const { eventId, response, email } = await params;

  try {
    const client = await clientPromise;
    const db = client.db('feest');

    // Update guest status
    await db.collection('events').updateOne(
      {
        _id: new ObjectId(eventId),
        'guests.email': decodeURIComponent(email)
      },
      {
        $set: {
          'guests.$.status': response,
          'guests.$.respondedAt': new Date()
        }
      }
    );

    // Redirect to a thank you page
    redirect(`/invite/${eventId}/thank-you`);
  } catch (error) {
    console.error('Error updating RSVP:', error);
    redirect('/error');
  }
}