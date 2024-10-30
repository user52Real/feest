// src/app/components/GuestList.tsx
import { Guest } from '@/app/types/events';

interface GuestListProps {
  guests: Guest[];
  capacity?: number;
  waitlist?: Guest[];
}

export default function GuestList({ guests, capacity, waitlist }: GuestListProps) {
  return (
    <div className="mt-8">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Guest List</h3>
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        {/* Capacity indicator */}
        {capacity && (
          <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
            <p className="text-sm text-gray-600">
              Capacity: {guests.length}/{capacity} spots filled
            </p>
          </div>
        )}

        {/* Guest List */}
        <ul className="divide-y divide-gray-200">
          {guests.length > 0 ? (
            guests.map((guest) => (
              <GuestListItem key={`${guest.email}-${guest.invitedAt}`} guest={guest} />
            ))
          ) : (
            <EmptyGuestList />
          )}
        </ul>

        {/* Waitlist */}
        {waitlist && waitlist.length > 0 && (
          <div>
            <div className="px-4 py-2 bg-yellow-50 border-t border-yellow-100">
              <h4 className="text-sm font-medium text-yellow-800">Waitlist</h4>
            </div>
            <ul className="divide-y divide-gray-200">
              {waitlist.map((guest) => (
                <GuestListItem 
                  key={`waitlist-${guest.email}-${guest.invitedAt}`} 
                  guest={guest} 
                  isWaitlisted
                />
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

interface GuestListItemProps {
  guest: Guest;
  isWaitlisted?: boolean;
}

function GuestListItem({ guest, isWaitlisted }: GuestListItemProps) {
  const statusStyles = {
    accepted: 'bg-green-100 text-green-800',
    declined: 'bg-red-100 text-red-800',
    pending: 'bg-yellow-100 text-yellow-800'
  };

  return (
    <li className="px-4 py-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-900">{guest.email}</p>
          <p className="text-sm text-gray-500">
            Invited on {new Date(guest.invitedAt).toLocaleDateString()}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {isWaitlisted && (
            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
              Waitlisted
            </span>
          )}
          <span
            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
              statusStyles[guest.status]
            }`}
          >
            {guest.status.charAt(0).toUpperCase() + guest.status.slice(1)}
          </span>
        </div>
      </div>
    </li>
  );
}

function EmptyGuestList() {
  return (
    <li className="px-4 py-4 text-sm text-gray-500">
      No guests have been invited yet.
    </li>
  );
}