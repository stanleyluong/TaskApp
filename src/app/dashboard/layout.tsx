import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
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
                  className="border-transparent text-gray-900 dark:text-gray-100 hover:border-gray-300 hover:text-gray-700 dark:hover:text-gray-300 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Dashboard
                </Link>
                <Link
                  href="/dashboard/tasks"
                  className="border-transparent text-gray-900 dark:text-gray-100 hover:border-gray-300 hover:text-gray-700 dark:hover:text-gray-300 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Tasks
                </Link>
                <Link
                  href="/dashboard/categories"
                  className="border-transparent text-gray-900 dark:text-gray-100 hover:border-gray-300 hover:text-gray-700 dark:hover:text-gray-300 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Categories
                </Link>
              </div>
            </div>
            <div className="flex items-center">
              <form
                action="/api/auth/logout"
                method="post"
                className="inline-block"
              >
                <button
                  type="submit"
                  className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Logout
                </button>
              </form>
            </div>
          </div>
        </div>
      </nav>
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </div>
    </div>
  );
}