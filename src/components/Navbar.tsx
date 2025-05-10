"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const apiBase = process.env.NEXT_PUBLIC_API_URL || '';

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const response = await fetch(`${apiBase}/api/auth/logout`, {
        method: "POST",
        redirect: "follow",
      });
      
      // Let the server handle the redirect
      if (response.redirected) {
        window.location.href = response.url;
      } else {
        // Fallback if redirect somehow doesn't work
        router.push("/login");
      }
    } catch (error) {
      console.error("Logout failed:", error);
      // Fallback to client-side navigation if fetch fails
      router.push("/login");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/dashboard" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-blue-600">TaskApp</span>
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                href="/dashboard"
                className={`${
                  pathname === '/dashboard'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-900 dark:text-gray-100 hover:border-gray-300'
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                Dashboard
              </Link>
              <Link
                href="/dashboard/tasks"
                className={`${
                  pathname === '/dashboard/tasks'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-900 dark:text-gray-100 hover:border-gray-300'
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                Tasks
              </Link>
              <Link
                href="/dashboard/categories"
                className={`${
                  pathname === '/dashboard/categories'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-900 dark:text-gray-100 hover:border-gray-300'
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                Categories
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoggingOut ? "Logging out..." : "Logout"}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}