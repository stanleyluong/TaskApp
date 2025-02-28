import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <h1 className="text-4xl font-bold mb-6">
        Welcome to TaskApp
      </h1>
      <p className="text-xl mb-8 max-w-2xl">
        Your personal task management system - organize, prioritize, and track your tasks efficiently
      </p>
      
      <div className="flex gap-4">
        <Link 
          href="/register" 
          className="px-6 py-3 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors"
        >
          Get Started
        </Link>
        <Link 
          href="/login" 
          className="px-6 py-3 bg-gray-200 dark:bg-gray-700 rounded-md font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          Login
        </Link>
      </div>
      
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl">
        <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg">
          <h2 className="text-xl font-semibold mb-3">Task Organization</h2>
          <p>Create, categorize, and manage your tasks with an intuitive interface</p>
        </div>
        
        <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg">
          <h2 className="text-xl font-semibold mb-3">Priority Levels</h2>
          <p>Set priority levels to focus on what matters most</p>
        </div>
        
        <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg">
          <h2 className="text-xl font-semibold mb-3">Deadline Tracking</h2>
          <p>Never miss a deadline with our built-in deadline tracking</p>
        </div>
      </div>
    </div>
  );
}