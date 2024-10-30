// src/app/components/GuestManagement.tsx
'use client';

import { useState } from 'react';
import { Event, Guest, GUEST_ROLES } from '../types/events';

interface GuestManagementProps {
  event: Event;
  onUpdate: (updatedGuests: Guest[]) => Promise<void>;
}

export default function GuestManagement({ event, onUpdate }: GuestManagementProps) {
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleRoleChange = async (guest: Guest, role: "guest" | "co-host" | "moderator" | undefined) => {
    const updatedGuests = event.guests.map(g => {
      if (g.email === guest.email) {
        return { ...g, role };
      }
      return g;
    });
    await onUpdate(updatedGuests);
  };

  const handleDietaryUpdate = async (guest: Guest, restrictions: string[]) => {
    const updatedGuests = event.guests.map(g => {
      if (g.email === guest.email) {
        return { ...g, dietaryRestrictions: restrictions };
      }
      return g;
    });
    await onUpdate(updatedGuests);
  };

  const handlePlusOneUpdate = async (guest: Guest, plusOneData: Guest['plusOne']) => {
    const updatedGuests = event.guests.map(g => {
      if (g.email === guest.email) {
        return { ...g, plusOne: plusOneData };
      }
      return g;
    });
    await onUpdate(updatedGuests);
  };

  const handleCheckIn = async (guest: Guest) => {
    const updatedGuests = event.guests.map(g => {
      if (g.email === guest.email) {
        return {
          ...g,
          checkedIn: true,
          checkedInAt: new Date()
        };
      }
      return g;
    });
    await onUpdate(updatedGuests);
  };

  return (
    <div className="bg-white shadow rounded-lg divide-y divide-gray-200">
      {/* Guest List */}
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Guest Management</h3>
        <div className="space-y-4">
          {event.guests.map((guest, index) => (
            <div
              key={`guest-${guest.email}-${index}`}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div>
                <h4 className="text-sm font-medium text-gray-900">{guest.name || guest.email}</h4>
                <p className="text-sm text-gray-500">
                  {guest.role ? GUEST_ROLES[guest.role as keyof typeof GUEST_ROLES].label : 'Guest'}
                </p>
              </div>

              <div className="flex items-center space-x-4">
                {/* Role Management */}
                <select
                  value={guest.role || 'guest'}
                  onChange={(e) => handleRoleChange(guest, e.target.value as "guest" | "co-host" | "moderator" | undefined)}
                  className="text-sm rounded-md border-gray-300"
                >
                  {Object.entries(GUEST_ROLES).map(([role, { label }]) => (
                    <option key={`role-${role}`} value={role}>{label}</option>
                  ))}
                </select>

                {/* Dietary Restrictions */}
                <button
                  onClick={() => {
                    setSelectedGuest(guest);
                    setIsEditing(true);
                  }}
                  className="text-sm text-blue-600 hover:text-blue-500"
                >
                  Dietary Preferences
                </button>

                {/* Plus One Management */}
                <button
                  onClick={() => {
                    setSelectedGuest(guest);
                    setIsEditing(true);
                  }}
                  className="text-sm text-blue-600 hover:text-blue-500"
                >
                  Manage Plus One
                </button>

                {/* Check-in Button */}
                <button
                  onClick={() => handleCheckIn(guest)}
                  disabled={guest.checkedIn}
                  className={`px-3 py-1 text-sm rounded-md ${
                    guest.checkedIn
                      ? 'bg-green-100 text-green-800'
                      : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                  }`}
                >
                  {guest.checkedIn ? 'Checked In' : 'Check In'}
                </button>
              </div>
            </div>
          ))}

          {/* Event Team Section */}
          <div className="mt-8">
            <h4 className="text-lg font-medium text-gray-900 mb-4">Event Team</h4>
            <div className="space-y-4">
              {event.guestRoles?.coHosts?.map((email, index) => (
                <div key={`cohost-${email}-${index}`} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{email}</p>
                    <p className="text-xs text-gray-500">Co-Host</p>
                  </div>
                </div>
              ))}
              {event.guestRoles?.moderators?.map((email, index) => (
                <div key={`moderator-${email}-${index}`} className="flex items-center justify-between">
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

      {/* Dietary Preferences Modal */}
      {isEditing && selectedGuest && (
        <DietaryPreferencesModal
          guest={selectedGuest}
          onClose={() => {
            setIsEditing(false);
            setSelectedGuest(null);
          }}
          onSave={async (restrictions) => {
            await handleDietaryUpdate(selectedGuest, restrictions);
            setIsEditing(false);
            setSelectedGuest(null);
          }}
        />
      )}
    </div>
  );
}

interface DietaryPreferencesModalProps {
  guest: Guest;
  onClose: () => void;
  onSave: (restrictions: string[]) => Promise<void>;
}

function DietaryPreferencesModal({ guest, onClose, onSave }: DietaryPreferencesModalProps) {
  const [selectedRestrictions, setSelectedRestrictions] = useState<string[]>(
    guest.dietaryRestrictions || []
  );

  const DIETARY_RESTRICTIONS = [
    'Vegetarian',
    'Vegan',
    'Gluten-Free',
    'Dairy-Free',
    'Nut-Free',
    'Halal',
    'Kosher',
    'Other'
  ];

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 className="text-lg font-medium mb-4">Dietary Preferences</h3>
        <div className="space-y-2">
          {DIETARY_RESTRICTIONS.map((restriction) => (
            <label key={`restriction-${restriction}`} className="flex items-center">
              <input
                type="checkbox"
                checked={selectedRestrictions.includes(restriction)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedRestrictions([...selectedRestrictions, restriction]);
                  } else {
                    setSelectedRestrictions(
                      selectedRestrictions.filter((r) => r !== restriction)
                    );
                  }
                }}
                className="mr-2"
              />
              {restriction}
            </label>
          ))}
        </div>
        <div className="mt-4 flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-700 hover:text-gray-500"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(selectedRestrictions)}
            className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}