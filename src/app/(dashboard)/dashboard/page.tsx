import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import clientPromise from '@/app/lib/mongodb';
import { Event } from '@/app/types/events';

interface LayoutProps {
  children: React.ReactNode;
}

async function getUpcomingEvents(userId: string) {
  try {
    const client = await clientPromise;
    const db = client.db('feest');
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const events = await db
      .collection('events')
      .find({
        userId,
        date: { $gte: today }
      })
      .sort({ date: 1 })
      .limit(5)
      .toArray();

    return events;
  } catch (error) {
    console.error('Error fetching upcoming events:', error);
    return [];
  }
}

async function getRecentActivity(userId: string) {
  try {
    const client = await clientPromise;
    const db = client.db('feest');
    
    const activities = await db
      .collection('events')
      .find({ userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .toArray();

    return activities;
  } catch (error) {
    console.error('Error fetching recent activity:', error);
    return [];
  }
}

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  const upcomingEvents = await getUpcomingEvents(userId);
  const recentActivity = await getRecentActivity(userId);

  return (
    <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-gradient-to-tr from-blue-400 to-purple-300 text-white min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Quick Actions Card */}
        <div className="bg-white text-black rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-4">
            <Link
              href="/dashboard/events/create"
              className="block w-full text-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-black bg-blue-400 hover:bg-blue-700"
            >
              Create New Event
            </Link>
            <Link
              href="/dashboard/events"
              className="block w-full text-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-black hover:bg-gray-50"
            >
              View All Events
            </Link>
          </div>
        </div>

        {/* Upcoming Events Card */}
        <div className="bg-white rounded-lg shadow p-6 text-black">
          <h2 className="text-lg font-semibold mb-4">Upcoming Events</h2>
          <div className="space-y-3">
            {upcomingEvents.length === 0 ? (
              <p className="text-gray-500 text-sm">No upcoming events</p>
            ) : (
              upcomingEvents.map((event) => (
                <Link
                  key={(event._id).toString()}
                  href={`/dashboard/events/${event._id}`}
                  className="block p-3 rounded-md hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900">{event.title}</h3>
                      <p className="text-sm text-gray-500">{event.location}</p>
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(event.date).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="mt-1 text-sm text-gray-500">
                    {event.guests?.length || 0} guests
                  </div>
                </Link>
              ))
            )}
          </div>
          {upcomingEvents.length > 0 && (
            <Link
              href="/dashboard/events"
              className="block mt-4 text-sm text-blue-600 hover:text-blue-800"
            >
              View all events →
            </Link>
          )}
        </div>

        {/* Recent Activity Card */}
        <div className="bg-white rounded-lg shadow p-6 text-black">
          <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {recentActivity.length === 0 ? (
              <p className="text-gray-500 text-sm">No recent activity</p>
            ) : (
              recentActivity.map((activity) => (
                <div
                  key={(activity._id).toString()}
                  className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-50"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.title}
                    </p>
                    <p className="text-sm text-gray-500">
                      Created on {new Date(activity.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Link
                    href={`/dashboard/events/${activity._id}`}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    View
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}