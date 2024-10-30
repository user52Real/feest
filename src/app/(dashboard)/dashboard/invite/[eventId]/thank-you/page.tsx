import Link from 'next/link';
import { getEvent } from '@/app/utils/eventUtils';

export default async function ThankYouPage({ 
  params 
}: { 
  params: { eventId: string } 
}) {
  const event = await getEvent(params.eventId);

  if (!event) {
    return <div>Event not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <h1 className="text-3xl font-extrabold">Thank You!</h1>
        <p className="mt-2 text-gray-600">
          Your response for {event.title} has been recorded.
        </p>
        <div className="mt-4">
          <Link
            href={`/events/${event._id}`}
            className="text-blue-600 hover:text-blue-500"
          >
            View Event Details
          </Link>
        </div>
      </div>
    </div>
  );
}