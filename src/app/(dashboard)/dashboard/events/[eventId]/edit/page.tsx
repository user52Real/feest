'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';

interface EventFormData {
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  guests: string;
}

interface PageProps {
  params: { eventId: string };
}

export default function EditEventPage({ params }: PageProps) {
  const router = useRouter();
  const { getToken } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    guests: ''
  });

  useEffect(() => {
    async function fetchEvent() {
      try {
        const token = await getToken();
        const response = await fetch(`/api/events/${params.eventId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch event');
        }

        const event = await response.json();
        setFormData({
          title: event?.title,
          description: event.description,
          date: new Date(event.date).toISOString().split('T')[0],
          time: event.time,
          location: event.location,
          guests: event.guests.map((g: { email: string }) => g.email).join(', ')
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load event');
      } finally {
        setIsLoading(false);
      }
    }

    fetchEvent();
  }, [params.eventId, getToken]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const token = await getToken();
      const response = await fetch(`/api/events/${params.eventId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          guests: formData.guests.split(',').map(email => email.trim())
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update event');
      }

      router.push('/dashboard/events');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="space-y-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-10 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Edit Event</h1>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-black">
            Event Title
          </label>
          <input
            type="text"
            id="title"
            required
            className="mt-1 block w-full text-black rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-black">
            Description
          </label>
          <textarea
            id="description"
            rows={3}
            className="mt-1 block w-full text-black rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-black">
              Date
            </label>
            <input
              type="date"
              id="date"
              required
              className="mt-1 block w-full text-black rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            />
          </div>

          <div>
            <label htmlFor="time" className="block text-sm font-medium text-black">
              Time
            </label>
            <input
              type="time"
              id="time"
              required
              className="mt-1 block w-full text-black rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-medium text-black">
            Location
          </label>
          <input
            type="text"
            id="location"
            required
            className="mt-1 block w-full text-black rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          />
        </div>

        <div>
          <label htmlFor="guests" className="block text-sm font-medium text-black">
            Guest Emails
          </label>
          <input
            type="text"
            id="guests"
            placeholder="email1@example.com, email2@example.com"
            className="mt-1 block w-full text-black rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={formData.guests}
            onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
          />
          <p className="mt-1 text-sm text-black">
            Separate multiple email addresses with commas
          </p>
        </div>

        <div className="flex items-center justify-end">
          <button
            type="button"
            className="mr-4 px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-500"
            onClick={() => router.back()}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}