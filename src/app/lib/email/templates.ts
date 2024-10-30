import { Event, Guest } from '@/app/types/events';

export const emailTemplates = {
  eventInvitation: (event: Event, guest: Guest) => `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Event Invitation</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; margin: 0; padding: 0;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #f8fafc; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
            <h1 style="color: #1e293b; margin-bottom: 16px;">You're Invited!</h1>
            <p style="color: #475569; margin-bottom: 24px;">
              You've been invited to attend ${event.title}
            </p>
            
            <div style="background-color: white; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
              <h2 style="color: #1e293b; font-size: 18px; margin-bottom: 16px;">Event Details</h2>
              <p style="color: #475569; margin-bottom: 8px;"><strong>Date:</strong> ${new Date(event.date).toLocaleDateString()}</p>
              <p style="color: #475569; margin-bottom: 8px;"><strong>Time:</strong> ${event.time}</p>
              <p style="color: #475569; margin-bottom: 8px;"><strong>Location:</strong> ${event.location}</p>
            </div>

            <div style="text-align: center;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/invite/${event._id}/accept/${encodeURIComponent(guest.email)}"
                 style="display: inline-block; background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 0 8px;">
                Accept
              </a>
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/invite/${event._id}/decline/${encodeURIComponent(guest.email)}"
                 style="display: inline-block; background-color: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 0 8px;">
                Decline
              </a>
            </div>
          </div>
        </div>
      </body>
    </html>
  `,

  eventReminder: (event: Event, guest: Guest) => `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Event Reminder</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; margin: 0; padding: 0;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #f8fafc; border-radius: 8px; padding: 20px;">
            <h1 style="color: #1e293b; margin-bottom: 16px;">Event Reminder</h1>
            <p style="color: #475569; margin-bottom: 24px;">
              This is a reminder about the upcoming event: ${event.title}
            </p>
            
            <div style="background-color: white; border-radius: 8px; padding: 16px;">
              <h2 style="color: #1e293b; font-size: 18px; margin-bottom: 16px;">Event Details</h2>
              <p style="color: #475569; margin-bottom: 8px;"><strong>Date:</strong> ${new Date(event.date).toLocaleDateString()}</p>
              <p style="color: #475569; margin-bottom: 8px;"><strong>Time:</strong> ${event.time}</p>
              <p style="color: #475569; margin-bottom: 8px;"><strong>Location:</strong> ${event.location}</p>
            </div>
          </div>
        </div>
      </body>
    </html>
  `,

  rsvpConfirmation: (event: Event, guest: Guest, response: 'accepted' | 'declined') => `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>RSVP Confirmation</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; margin: 0; padding: 0;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #f8fafc; border-radius: 8px; padding: 20px;">
            <h1 style="color: #1e293b; margin-bottom: 16px;">RSVP Confirmation</h1>
            <p style="color: #475569; margin-bottom: 24px;">
              Your RSVP has been recorded as: <strong>${response}</strong>
            </p>
            
            <div style="background-color: white; border-radius: 8px; padding: 16px;">
              <h2 style="color: #1e293b; font-size: 18px; margin-bottom: 16px;">Event Details</h2>
              <p style="color: #475569; margin-bottom: 8px;"><strong>Event:</strong> ${event.title}</p>
              <p style="color: #475569; margin-bottom: 8px;"><strong>Date:</strong> ${new Date(event.date).toLocaleDateString()}</p>
              <p style="color: #475569; margin-bottom: 8px;"><strong>Time:</strong> ${event.time}</p>
              <p style="color: #475569; margin-bottom: 8px;"><strong>Location:</strong> ${event.location}</p>
            </div>
          </div>
        </div>
      </body>
    </html>
  `
};