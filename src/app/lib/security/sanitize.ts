import DOMPurify from 'isomorphic-dompurify';
import { z } from 'zod';

// Message schema validation
export const messageSchema = z.object({
  content: z.string().min(1).max(1000),
  group: z.enum(['all', 'co-hosts', 'moderators']).optional(),
});

// Event schema validation
export const eventSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(2000),
  date: z.string(),
  time: z.string(),
  location: z.string().min(1),
  guests: z.array(z.string().email()),
  isPublic: z.boolean(),
  category: z.string(),
  tags: z.array(z.string()),
  capacity: z.number().optional(),
});

export function sanitizeInput(input: string): string {
  return DOMPurify.sanitize(input.trim());
}

export function validateAndSanitizeMessage(data: unknown) {
  const validated = messageSchema.parse(data);
  return {
    content: sanitizeInput(validated.content),
    group: validated.group,
  };
}

export function validateAndSanitizeEvent(data: unknown) {
  const validated = eventSchema.parse(data);
  return {
    ...validated,
    title: sanitizeInput(validated.title),
    description: sanitizeInput(validated.description),
    location: sanitizeInput(validated.location),
    tags: validated.tags.map(tag => sanitizeInput(tag)),
  };
}