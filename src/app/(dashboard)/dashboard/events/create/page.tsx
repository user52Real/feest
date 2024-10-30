'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import { EVENT_CATEGORIES } from '@/app/types/events';

interface EventFormData {
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  guests: string;
  isPublic: boolean;
  category: string;
  tags: string[];
  capacity: string;
  recurrence?: {
    frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
    interval: string;
    endDate?: string;
    daysOfWeek?: number[];
  };
  template: boolean;
}

const INITIAL_FORM_DATA: EventFormData = {
  title: '',
  description: '',
  date: '',
  time: '',
  location: '',
  guests: '',
  isPublic: false,
  category: 'Other',
  tags: [],
  capacity: '', // Empty string instead of number
  template: false,
  recurrence: {
    frequency: 'daily',
    interval: '1', // String instead of number
    endDate: '',
    daysOfWeek: []
  }
};

export default function CreateEventPage() {
  const router = useRouter();
  const { getToken } = useAuth();  
  const [formData, setFormData] = useState<EventFormData>(INITIAL_FORM_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const token = await getToken();

      // Convert string values to numbers before sending to API
      const eventData = {
        ...formData,
        capacity: formData.capacity ? parseInt(formData.capacity) : null,
        guests: formData.guests.split(',').map(email => email.trim()),
        recurrence: formData.recurrence && formData.recurrence.frequency ? {
          ...formData.recurrence,
          interval: parseInt(formData.recurrence.interval || '1')
        } : null
      };
      
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(eventData),
      });

      if (!response.ok) {
        throw new Error('Failed to create event');
      }

      router.push('/dashboard/events');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Create New Event</h1>
        <p className="mt-2 text-sm text-black">
          Fill in the details below to create your event and invite guests.
        </p>
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
              className="mt-1 block text-black w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
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

        <div>
        <label htmlFor="capacity" className="block text-sm font-medium text-black">
          Capacity
        </label>
        <input
          type="number"
          id="capacity"
          min="0"
          className="mt-1 block w-full text-black rounded-md border border-gray-300 px-3 py-2"
          value={formData.capacity}
          onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
        />
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium text-black">
          Category
        </label>
        <select
          id="category"
          className="mt-1 block w-full text-black rounded-md border border-gray-300 px-3 py-2"
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
        >
          <option value="Social">Social</option>
          <option value="Business">Business</option>
          <option value="Education">Education</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div>
        <label htmlFor="tags" className="block text-sm font-medium text-black">
          Tags
        </label>
        <input
          type="text"
          id="tags"
          placeholder="Enter tags separated by commas"
          className="mt-1 block w-full text-black rounded-md border border-gray-300 px-3 py-2"
          value={formData.tags.join(', ')}
          onChange={(e) => setFormData({
            ...formData,
            tags: e.target.value.split(',').map(tag => tag.trim())
          })}
        />
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="isPublic"
          checked={formData.isPublic}
          onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
          className="h-4 w-4 text-blue-600 rounded border-gray-300"
        />
        <label htmlFor="isPublic" className="text-sm text-black">
          Make this event public
        </label>
      </div>

      <div>
        <label htmlFor="recurrence" className="block text-sm font-medium text-black">
          Recurrence
        </label>
        <select
          id="recurrence"
          className="mt-1 block w-full text-black rounded-md border border-gray-300 px-3 py-2"
          value={formData.recurrence?.frequency || 'none'}
          onChange={(e) => {
            const frequency = e.target.value as 'daily' | 'weekly' | 'monthly' | 'yearly' | 'none';
            setFormData({
              ...formData,
              recurrence: frequency === 'none' ? undefined : {
                frequency,
                interval: '1',
                endDate: '',
                daysOfWeek: []
              }
            });
          }}        >
          <option value="none">No recurrence</option>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
      </div>

      {formData.recurrence && (
        <>
          <div>
            <label htmlFor="interval" className="block text-sm font-medium text-black">
              Repeat every
            </label>
            <input
              type="number"
              id="interval"
              min="1"
              className="mt-1 block w-full text-black rounded-md border border-gray-300 px-3 py-2"
              value={formData.recurrence.interval}
              onChange={(e) => setFormData({
                ...formData,
                recurrence: {
                  ...formData.recurrence!,
                  interval: e.target.value
                }
              })}
            />
          </div>

          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-black">
              End Date
            </label>
            <input
              type="date"
              id="endDate"
              className="mt-1 block w-full text-black rounded-md border border-gray-300 px-3 py-2"
              value={formData.recurrence.endDate}
              onChange={(e) => setFormData({
                ...formData,
                recurrence: {
                  ...formData.recurrence!,
                  endDate: e.target.value
                }
              })}
            />
          </div>
        </>
      )}

        <div className="flex items-center justify-end ">
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
            {isSubmitting ? 'Creating...' : 'Create Event'}
          </button>
        </div>
      </form>
    </div>
  );
}