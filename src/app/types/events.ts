export interface Event {    
    _id?: string;
    title: string;
    description: string;
    date: Date;
    time: string;
    location: string;
    organizer: string;
    userId: string;
    guests: Guest[];
    createdAt: Date;
    updatedAt: Date;
    status: 'draft' | 'published' | 'cancelled' | 'completed';
    capacity: number;
    ticketTypes: TicketType[];
    venue: Venue;
    category: string;
    tags: string[];
    waitlist: Guest[];
    isPublic: any;
    recurrence?: {
        frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
        interval: number;
        endDate?: Date;
        daysOfWeek?: number[]; // 0-6 for Sunday-Saturday
    };
    template?: boolean;
    guestRoles: {
        coHosts: string[];
        moderators: string[];
    };
    guestPreferences: {
        dietaryRestrictions: boolean;
        plusOne: boolean;
        maxPlusOnes: number;
    };
    checkedInGuests: string[];
}

export interface TicketType {
    name: string;
    price: number;
    quantity: number;
    description: string;
    salesStart: Date;
    salesEnd: Date;
}
  
export interface Venue {
    name: string;
    address: string;
    city: string;
    country: string;
    coordinates: {
        lat: number;
        lng: number;
    };
}
  
export interface Guest {
    email: string;
    name: string;
    status: 'pending' | 'accepted' | 'declined';
    invitedAt: Date;
    respondedAt?: Date;
    role?: 'guest' | 'co-host' | 'moderator';
    dietaryRestrictions?: string[];
    plusOne?: {
        name?: string;
        email?: string;
        dietaryRestrictions?: string[];
        status: 'pending' | 'confirmed';
    };
    checkedIn?: boolean;
    checkedInAt?: Date;
}

export interface EventResponse {
    success: boolean;
    error?: string;
    data?: Event;
}

export const EVENT_CATEGORIES = [
    'Social',
    'Business',
    'Education',
    'Sports',
    'Entertainment',
    'Other'
] as const;

export const DIETARY_RESTRICTIONS = [
    'Vegetarian',
    'Vegan',
    'Gluten-Free',
    'Dairy-Free',
    'Nut-Free',
    'Halal',
    'Kosher',
    'Other'
] as const;

export const GUEST_ROLES = {
    'co-host': {
      label: 'Co-Host',
      permissions: ['manage_guests', 'edit_event', 'message_all']
    },
    'moderator': {
      label: 'Moderator',
      permissions: ['manage_guests', 'message_all']
    },
    'guest': {
      label: 'Guest',
      permissions: ['message_group']
    }
} as const;

export type EventCategory = typeof EVENT_CATEGORIES[number];
