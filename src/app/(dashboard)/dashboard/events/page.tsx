import { auth } from '@clerk/nextjs/server';
import Link from 'next/link';
import clientPromise from '@/app/lib/mongodb';
import { Event } from '@/app/types/events';
import { WithId, Document } from 'mongodb';

async function getEvents(userId: string) {
  try {
    const client = await clientPromise;
    const db = client.db('feest');
    
    const events = await db
      .collection('events')
      .find({ userId })
      .sort({ date: -1 })
      .toArray();

    return events.map((event) => ({
      _id: event._id.toString(),
      title: event.title,
      description: event.description,
      date: event.date,
      time: event.time,
      location: event.location,
      guests: event.guests,
      userId: event.userId,
      createdAt: event.createdAt,
      updatedAt: event.updatedAt
    })) as Event[];
  } catch (error) {
    console.error('Error fetching events:', error);
    return [];
  }
}

export default async function EventsPage() {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  const events = await getEvents(userId);

  return (
    <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-gradient-to-tr from-blue-400 to-purple-300 w-full min-h-screen">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Events</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all events you've created and organized.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <Link
            href="/dashboard/events/create"
            className="inline-flex items-center justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white shadow-sm focus:outline-none sm:w-auto bg-gradient-to-tr from-blue-500 to-purple-500"
          >
            Create Event
          </Link>
        </div>
      </div>

      <div className="mt-8 flex flex-col">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle">
            <div className="overflow-hidden shadow-sm ring-1 ring-black ring-opacity-5">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gradient-to-tr from-blue-500 to-purple-500">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-white sm:pl-6 lg:pl-8">
                      Event Name
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">
                      Date
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">
                      Location
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">
                      Guests
                    </th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6 lg:pr-8">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {events.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                        No events found. Create your first event!
                      </td>
                    </tr>
                  ) : (
                    events.map((event: Event) => (
                      <tr key={event._id} className="hover:bg-gray-50">
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8">
                          {event.title}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {new Date(event.date).toLocaleDateString()}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {event.location}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {event.guests?.length || 0} guests
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 lg:pr-8">
                          <Link
                            href={`/dashboard/events/${event._id}`}
                            className="text-blue-600 hover:text-blue-900 mr-4"
                          >
                            View
                          </Link>
                          <Link
                            href={`/dashboard/events/${event._id}/edit`}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Edit
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}