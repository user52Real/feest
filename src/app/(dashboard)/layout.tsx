import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { ClerkProvider, UserButton } from '@clerk/nextjs';
import Link from 'next/link';

export default async function DashboardLayout({children}: {  children: React.ReactNode;}) {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  return (
    <ClerkProvider>
      <div className="min-h-screen bg-gray-50">        
        <nav className="shadow-sm bg-gradient-to-tr from-purple-500 to-blue-500">
          <div className="mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              
              <img src="/images/logo.svg" alt="Company Logo" className="h-12 my-auto" />            
              
              <div className="hidden md:flex items-center space-x-8">
                <Link 
                  href="/dashboard" 
                  className="flex items-center px-3 py-2 text-white font-semibold text-md hover:text-gray-200 transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  href="/dashboard/events"
                  className="flex items-center px-3 py-2 text-white font-medium text-md hover:text-gray-200 transition-colors"
                >
                  Events
                </Link>
                <Link
                  href="/dashboard/settings"
                  className="flex items-center px-3 py-2 text-white font-medium text-md hover:text-gray-200 transition-colors"
                >
                  Settings
                </Link>
              </div>            
              <div className="flex items-center space-x-4">
                <UserButton />
                
              </div>            
              <button className="md:hidden p-2 rounded-md text-white hover:bg-purple-600">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </nav>
      <main>{children}</main>
      </div>
    </ClerkProvider>
  );
}