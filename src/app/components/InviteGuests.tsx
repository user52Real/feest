'use client';

import { useState } from 'react';
import { useAuth } from '@clerk/nextjs';

interface InviteGuestsProps {
  eventId: string;
  onInviteSuccess?: () => void;
}

export default function InviteGuests({ eventId, onInviteSuccess }: InviteGuestsProps) {
  const [emails, setEmails] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { getToken } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const token = await getToken();
      const guestEmails = emails.split(',').map(email => email.trim());

      const response = await fetch('/api/invitations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          eventId,
          guests: guestEmails,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send invitations');
      }

      setEmails('');
      if (onInviteSuccess) {
        onInviteSuccess();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send invitations');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Invite Guests</h3>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="emails" className="block text-sm font-medium text-gray-700">
            Email Addresses
          </label>
          <textarea
            id="emails"
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Enter email addresses separated by commas"
            value={emails}
            onChange={(e) => setEmails(e.target.value)}
          />
          <p className="mt-2 text-sm text-gray-500">
            Separate multiple email addresses with commas
          </p>
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !emails.trim()}
          className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {isSubmitting ? 'Sending Invitations...' : 'Send Invitations'}
        </button>
      </form>
    </div>
  );
}