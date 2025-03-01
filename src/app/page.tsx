import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 py-20">
        <div className="container mx-auto px-4 flex flex-col items-center text-center">
          <div className="mb-8 animate-bounce-slow">
            <Image 
              src="/images/logo.svg" 
              alt="TaskApp Logo" 
              width={140} 
              height={140}
              className="drop-shadow-lg"
              priority
            />
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Welcome to TaskApp
          </h1>
          
          <p className="text-xl md:text-2xl mb-10 max-w-2xl text-gray-600 dark:text-gray-300">
            Your personal task management system - organize, prioritize, and track your tasks efficiently
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Link 
              href="/register" 
              className="px-8 py-4 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Get Started
            </Link>
            <Link 
              href="/login" 
              className="px-8 py-4 bg-white dark:bg-gray-700 text-blue-600 dark:text-white border-2 border-blue-600 dark:border-gray-600 rounded-xl font-medium hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
      
      {/* Features Section */}
      <div className="py-20 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16 text-gray-800 dark:text-white">Why Choose TaskApp?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
            <div className="p-8 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg hover:shadow-xl transition-shadow bg-white dark:bg-gray-700 transform hover:-translate-y-1 transition-transform">
              <div className="bg-blue-100 dark:bg-blue-900 rounded-full w-16 h-16 flex items-center justify-center mb-6 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-blue-600 dark:text-blue-300">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 0 1 0 3.75H5.625a1.875 1.875 0 0 1 0-3.75Z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-center">Task Organization</h3>
              <p className="text-center text-gray-600 dark:text-gray-300">Create, categorize, and manage your tasks with an intuitive interface designed for productivity</p>
            </div>
            
            <div className="p-8 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg hover:shadow-xl transition-shadow bg-white dark:bg-gray-700 transform hover:-translate-y-1 transition-transform">
              <div className="bg-blue-100 dark:bg-blue-900 rounded-full w-16 h-16 flex items-center justify-center mb-6 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-blue-600 dark:text-blue-300">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 4.5h14.25M3 9h9.75M3 13.5h9.75m4.5-4.5v12m0 0-3.75-3.75M17.25 21 21 17.25" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-center">Priority Levels</h3>
              <p className="text-center text-gray-600 dark:text-gray-300">Set priority levels to focus on what matters most and accomplish your goals efficiently</p>
            </div>
            
            <div className="p-8 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg hover:shadow-xl transition-shadow bg-white dark:bg-gray-700 transform hover:-translate-y-1 transition-transform">
              <div className="bg-blue-100 dark:bg-blue-900 rounded-full w-16 h-16 flex items-center justify-center mb-6 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-blue-600 dark:text-blue-300">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-center">Deadline Tracking</h3>
              <p className="text-center text-gray-600 dark:text-gray-300">Never miss a deadline with our built-in deadline tracking and notification system</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Call to Action */}
      <div className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to boost your productivity?</h2>
          <p className="max-w-2xl mx-auto mb-8 text-xl">Join thousands of users who've transformed their task management experience</p>
          <Link 
            href="/register" 
            className="px-8 py-4 bg-white text-blue-600 rounded-xl font-medium hover:bg-gray-100 transition-colors shadow-lg inline-block"
          >
            Start for Free
          </Link>
        </div>
      </div>
    </div>
  );
}