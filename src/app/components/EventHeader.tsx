import Link from 'next/link';
import DeleteEventButton from '@/app/components/DeleteEventButton';
import { Event } from '@/app/types/events';

export default function EventHeader({ event }: { event: Event }) {
  return (
    <div className="mb-8 flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{event.title}</h1>
        <p className="mt-1 text-sm text-gray-500">
          Created on {new Date(event.createdAt).toLocaleDateString()}
        </p>
      </div>
      <div className="flex space-x-3">
        <Link
          href={`/dashboard/events/${event._id}/edit`}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Edit Event
        </Link>
        <DeleteEventButton eventId={event._id!.toString()} />
      </div>
    </div>
  );
}