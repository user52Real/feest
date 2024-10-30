import { ClerkProvider } from '@clerk/nextjs';
import { Inter } from 'next/font/google';
import './globals.css';
import { Metadata } from 'next';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Event Management Platform',
  description: 'Create and manage your events easily',
  keywords: 'events, management, rsvp, planning',
  openGraph: {
    title: 'Event Management Platform',
    description: 'Create and manage your events easily',
    images: ['/og-image.jpg'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">        
        <body className={inter.className}>
          <main className="min-h-screen bg-gray-100">
            {children}
          </main>
        </body>
      </html>
    </ClerkProvider>
  );
}