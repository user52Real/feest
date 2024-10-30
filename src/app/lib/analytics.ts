import clientPromise from './mongodb';
import { auth } from '@clerk/nextjs/server';

interface EventStats {
  totalEvents: number;
  eventsTrend: number;
  totalAttendees: number;
  attendeesTrend: number;
  totalRevenue: number;
  revenueTrend: number;
}

export async function getEventStats(): Promise<EventStats> {
  const { userId } = await auth();
  if (!userId) {
    throw new Error('Unauthorized');
  }

  const client = await clientPromise;
  const db = client.db('feest');

  // Get current and previous month dates
  const now = new Date();
  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  // Get events for current and previous month
  const [currentMonthEvents, previousMonthEvents] = await Promise.all([
    db.collection('events').find({
      userId,
      createdAt: { $gte: currentMonthStart }
    }).toArray(),
    db.collection('events').find({
      userId,
      createdAt: { 
        $gte: previousMonthStart,
        $lt: currentMonthStart
      }
    }).toArray()
  ]);

  // Calculate total events and trend
  const totalEvents = await db.collection('events').countDocuments({ userId });
  const eventsTrend = calculateTrend(
    currentMonthEvents.length,
    previousMonthEvents.length
  );

  // Calculate attendees stats
  const currentMonthAttendees = currentMonthEvents.reduce(
    (sum, event) => sum + countAcceptedGuests(event), 0
  );
  const previousMonthAttendees = previousMonthEvents.reduce(
    (sum, event) => sum + countAcceptedGuests(event), 0
  );
  const totalAttendees = (await db.collection('events')
    .find({ userId })
    .toArray())
    .reduce((sum, event) => sum + countAcceptedGuests(event), 0);
  const attendeesTrend = calculateTrend(
    currentMonthAttendees,
    previousMonthAttendees
  );

  // Calculate revenue stats (if you have ticket prices)
  const currentMonthRevenue = calculateRevenue(currentMonthEvents);
  const previousMonthRevenue = calculateRevenue(previousMonthEvents);
  const totalRevenue = (await db.collection('events')
    .find({ userId })
    .toArray())
    .reduce((sum, event) => sum + calculateEventRevenue(event), 0);
  const revenueTrend = calculateTrend(
    currentMonthRevenue,
    previousMonthRevenue
  );

  return {
    totalEvents,
    eventsTrend,
    totalAttendees,
    attendeesTrend,
    totalRevenue,
    revenueTrend
  };
}

function calculateTrend(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
}

function countAcceptedGuests(event: any): number {
  return event.guests?.filter((guest: any) => guest.status === 'accepted').length || 0;
}

function calculateEventRevenue(event: any): number {
  // If you have ticket pricing, calculate based on your pricing model
  // This is a simple example assuming a fixed price per accepted guest
  const fixedTicketPrice = 10; // Example price
  return countAcceptedGuests(event) * fixedTicketPrice;
}

function calculateRevenue(events: any[]): number {
  return events.reduce((sum, event) => sum + calculateEventRevenue(event), 0);
}