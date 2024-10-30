'use client';

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

interface NotificationSettings {
  emailNotifications: boolean;
  eventReminders: boolean;
  guestUpdates: boolean;
}

interface UserPreferences {
  timezone: string;
  dateFormat: '12h' | '24h';
  language: string;
}

export default function SettingsPage() {
  const { user } = useUser();
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [notifications, setNotifications] = useState<NotificationSettings>({
    emailNotifications: true,
    eventReminders: true,
    guestUpdates: true,
  });
  
  const [preferences, setPreferences] = useState<UserPreferences>({
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    dateFormat: '12h',
    language: 'en',
  });

  const handleNotificationChange = (setting: keyof NotificationSettings) => {
    setNotifications(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const handlePreferenceChange = (
    setting: keyof UserPreferences,
    value: string
  ) => {
    setPreferences(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          notifications,
          preferences,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save settings');
      }

      router.refresh();
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-gradient-to-tr from-blue-400 to-purple-300 text-black">
      <div className="space-y-8 ">
        {/* Profile Section */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6 ">Profile Settings</h2>
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center space-x-6">
              <div className="h-24 w-24 rounded-full overflow-hidden">
                <img
                  src={user?.imageUrl}
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">{user?.fullName}</h3>
                <p className="text-sm text-gray-500">{user?.primaryEmailAddress?.emailAddress}</p>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Notification Settings */}
          <div className="bg-white shadow rounded-lg p-6 mb-6 text-black">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Notifications</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="font-medium text-gray-700">Email Notifications</label>
                  <p className="text-sm text-gray-500">Receive emails about your events</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleNotificationChange('emailNotifications')}
                  className={`${
                    notifications.emailNotifications ? 'bg-blue-600' : 'bg-gray-200'
                  } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out`}
                >
                  <span
                    className={`${
                      notifications.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                    } inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out mt-1`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="font-medium text-gray-700">Event Reminders</label>
                  <p className="text-sm text-gray-500">Get reminded about upcoming events</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleNotificationChange('eventReminders')}
                  className={`${
                    notifications.eventReminders ? 'bg-blue-600' : 'bg-gray-200'
                  } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out`}
                >
                  <span
                    className={`${
                      notifications.eventReminders ? 'translate-x-6' : 'translate-x-1'
                    } inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out mt-1`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div className="bg-white shadow rounded-lg p-6 mb-6 text-black">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Preferences</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Timezone</label>
                <select
                  value={preferences.timezone}
                  onChange={(e) => handlePreferenceChange('timezone', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="UTC">UTC</option>
                  <option value="America/New_York">Eastern Time</option>
                  <option value="America/Los_Angeles">Pacific Time</option>
                  <option value="Europe/London">London</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Date Format</label>
                <select
                  value={preferences.dateFormat}
                  onChange={(e) => handlePreferenceChange('dateFormat', e.target.value as '12h' | '24h')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="12h">12-hour</option>
                  <option value="24h">24-hour</option>
                </select>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}