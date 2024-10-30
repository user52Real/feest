// src/app/lib/email.ts
import { Resend } from 'resend';
import { Event, Guest } from '../types/events';
import { emailTemplates } from './email/templates';

if (!process.env.RESEND_API_KEY) {
  throw new Error('RESEND_API_KEY is missing in environment variables');
}

const resend = new Resend(process.env.RESEND_API_KEY);

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

export async function sendEmail({ to, subject, html, from }: EmailOptions) {
  try {
    const response = await resend.emails.send({
      from: from || process.env.EMAIL_FROM || 'events@yourdomain.com',
      to,
      subject,
      html
    });

    return { success: true, messageId: response.data?.id };
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}

export async function sendEventInvitation(event: Event, guest: Guest) {
  const inviteUrl = `${process.env.NEXT_PUBLIC_APP_URL}/invite/${event._id}`;
  
  return sendEmail({
    to: guest.email,
    subject: `You're invited to ${event.title}!`,
    html: emailTemplates.eventInvitation(event, guest)
  });
}

export async function sendEventReminder(event: Event, guest: Guest) {
  return sendEmail({
    to: guest.email,
    subject: `Reminder: ${event.title} is coming up!`,
    html: emailTemplates.eventReminder(event, guest)
  });
}

export async function sendRSVPConfirmation(event: Event, guest: Guest, response: 'accepted' | 'declined') {
  return sendEmail({
    to: guest.email,
    subject: `RSVP Confirmation: ${event.title}`,
    html: emailTemplates.rsvpConfirmation(event, guest, response)
  });
}