import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { SignOutButton, UserButton } from '@clerk/nextjs';
import Link from 'next/link';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  return (
    <div className="min-h-screen bg-gray-50 ">        
      <nav className="shadow-sm bg-gradient-to-tr from-purple-500 to-blue-500 text-black">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <img src="/images/logo.svg" alt="logo" className="h-12 mr-20" />
            <div className="flex">
              <Link 
                href="/dashboard" 
                className="flex items-center px-2 text-black font-semibold text-md"
              >
                Dashboard
              </Link>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link
                  href="/dashboard/events"
                  className="inline-flex items-center px-1 pt-1 text-md font-medium text-black hover:text-gray-900"
                >
                  Events
                </Link>
                <Link
                  href="/dashboard/settings"
                  className="inline-flex items-center px-1 pt-1 text-md font-medium text-black hover:text-gray-900"
                >
                  Settings
                </Link>
              </div>
            </div>
            <div className="flex items-center">
              {/* <UserButton signOutForceRedirectUrl="/" /> */}
              <SignOutButton />
            </div>
          </div>
        </div>
      </nav>
      <main>{children}</main>
    </div>
  );
}