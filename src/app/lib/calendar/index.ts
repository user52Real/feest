import { google } from 'googleapis';
import ical from 'ical-generator';
import { Event } from '@/app/types/events';

export async function addToGoogleCalendar(event: Event, accessToken: string) {
  const calendar = google.calendar({ version: 'v3', auth: accessToken });
  
  const calendarEvent = {
    summary: event.title,
    description: event.description,
    start: {
      dateTime: new Date(event.date).toISOString(),
      timeZone: 'UTC',
    },
    end: {
      dateTime: new Date(event.date).toISOString(),
      timeZone: 'UTC',
    },
    location: event.location,
  };

  try {
    const response = await calendar.events.insert({
      calendarId: 'primary',
      requestBody: calendarEvent,
    });
    return response.data;
  } catch (error) {
    console.error('Error adding to Google Calendar:', error);
    throw error;
  }
}

export function generateICalFile(event: Event) {
  const calendar = ical();
  
  calendar.createEvent({
    start: new Date(event.date),
    end: new Date(event.date),
    summary: event.title,
    description: event.description,
    location: event.location,
  });

  return calendar.toString();
}