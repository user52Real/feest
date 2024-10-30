import { ClerkProvider } from '@clerk/nextjs';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

// export async function generateMetadata() {
//   return {
//     metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL!),
//     alternates: {
//       canonical: '/',
//     },
//     openGraph: {
//       images: '/og-image.png',
//     },
//   };
// }

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