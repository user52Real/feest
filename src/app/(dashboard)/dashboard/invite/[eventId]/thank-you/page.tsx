import Link from 'next/link';
import { getEvent } from '@/app/utils/eventUtils';

interface ThankYouPageProps {
  params: Promise<{ eventId: string }>;
}

export default async function ThankYouPage({ params }: ThankYouPageProps) {
  // Await the params
  const { eventId } = await params;
  
  const event = await getEvent(eventId);

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 text-center">
          <h1 className="text-3xl font-extrabold text-gray-900">Event Not Found</h1>
          <p className="mt-2 text-gray-600">
            The event you're looking for could not be found.
          </p>
          <Link
            href="/"
            className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-500"
          >
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <h1 className="text-3xl font-extrabold text-gray-900">Thank You!</h1>
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