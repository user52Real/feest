export interface UserSettings {
    notifications: {
      emailNotifications: boolean;
      eventReminders: boolean;
      guestUpdates: boolean;
    };
    preferences: {
      timezone: string;
      dateFormat: '12h' | '24h';
      language: string;
    };
    userId: string;
    createdAt: Date;
    updatedAt: Date;
}