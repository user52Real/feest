
import { redirect } from 'next/navigation';
import { ObjectId } from 'mongodb';
import clientPromise from '@/app/lib/mongodb';

export default async function RSVPPage({ 
  params 
}: { 
  params: { eventId: string; response: 'accept' | 'decline'; email: string } 
}) {
  const { eventId, response, email } = params;

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