import { auth } from '@clerk/nextjs/server';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import EventHeader from '../../../../components/EventHeader';
import EventDetails from '../../../../components/EventDetails';
import GuestList from '../../../../components/GuestList';
import { getEvent } from '../../../../utils/eventUtils';
import GuestManagement from '@/app/components/GuestManagement';
import GuestChat from '@/app/components/GuestChat';

interface PageProps {
  params: Promise<{ eventId: string }>;
}

// Loading component
function EventPageLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="animate-pulse">
        <div className="mb-8">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="mt-2 h-4 bg-gray-200 rounded w-1/3"></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="h-40 bg-gray-200 rounded"></div>
            <div className="h-60 bg-gray-200 rounded"></div>
          </div>
          <div className="space-y-6">
            <div className="h-96 bg-gray-200 rounded"></div>
            <div className="h-48 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main component wrapper
export default function EventPageWrapper({ params }: PageProps) {
  return (
    <Suspense fallback={<EventPageLoading />}>
      <EventPage params={params} />
    </Suspense>
  );
}

// Main component
async function EventPage({ params }: PageProps) {
  const { userId } = await auth();
  const { eventId } = await params;
  
  if (!userId) {
    return null;
  }

  const event = await getEvent(eventId);

  if (!event || event.userId !== userId) {
    notFound();
  }

  const handleGuestUpdate = async (updatedGuests: any) => {
    'use server';
    try {
      await fetch(`/api/events/${eventId}/guests`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ guests: updatedGuests }),
      });
    } catch (error) {
      console.error('Error updating guests:', error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <EventHeader event={event} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          <EventDetails event={event} />

          
          
          <GuestManagement 
            event={event}
            onUpdate={handleGuestUpdate}
          />

          <GuestList 
            guests={event.guests}
            capacity={event.capacity}
            waitlist={event.waitlist}
          />
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Guest Chat */}
          <div className="bg-white shadow rounded-lg p-6 text-black">
            <h3 className="text-lg font-medium text-black mb-4">Chat with Guests</h3>
            <GuestChat 
              eventId={event._id!.toString()}
              eventTitle={event.title}
              currentUserEmail={userId}
              guestRole={event.guestRoles}
            />
          </div>

          {/* Event Statistics */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Event Stats</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Total Guests</p>
                <p className="text-2xl font-semibold">{event.guests.length}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Accepted</p>
                <p className="text-2xl font-semibold text-green-600">
                  {event.guests.filter(g => g.status === 'accepted').length}
                </p>
              </div>
              {event.capacity && (
                <div>
                  <p className="text-sm text-gray-500">Capacity</p>
                  <p className="text-2xl font-semibold">
                    {event.guests.length}/{event.capacity}
                  </p>
                </div>
              )}
              {event.waitlist && event.waitlist.length > 0 && (
                <div>
                  <p className="text-sm text-gray-500">Waitlist</p>
                  <p className="text-2xl font-semibold text-yellow-600">
                    {event.waitlist.length}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Guest Roles */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Event Team</h3>
            <div className="space-y-4">
              {event.guestRoles?.coHosts?.map((email: string) => (
                <div key={email} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{email}</p>
                    <p className="text-xs text-gray-500">Co-Host</p>
                  </div>
                </div>
              ))}
              {event.guestRoles?.moderators?.map((email: string) => (
                <div key={email} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{email}</p>
                    <p className="text-xs text-gray-500">Moderator</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          

        </div>
      </div>
    </div>
  );
}