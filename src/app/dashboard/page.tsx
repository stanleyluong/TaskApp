"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Task {
  id: string;
  title: string;
  status: string;
  priority: string;
  dueDate: string | null;
  category: { name: string } | null;
}

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [upcomingTasks, setUpcomingTasks] = useState<Task[]>([]);
  const [highPriorityTasks, setHighPriorityTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch("/api/tasks");
        if (!response.ok) {
          throw new Error("Failed to fetch tasks");
        }
        const data = await response.json();
        setTasks(data);

        // Filter for upcoming tasks (due in the next 7 days)
        const now = new Date();
        const nextWeek = new Date(now);
        nextWeek.setDate(now.getDate() + 7);

        const upcoming = data.filter((task: Task) => {
          if (!task.dueDate) return false;
          const dueDate = new Date(task.dueDate);
          return dueDate >= now && dueDate <= nextWeek && task.status !== "DONE";
        });
        setUpcomingTasks(upcoming);

        // Filter for high priority tasks
        const highPriority = data.filter(
          (task: Task) => task.priority === "HIGH" && task.status !== "DONE"
        );
        setHighPriorityTasks(highPriority);
      } catch (err) {
        setError("Failed to load tasks. Please try again later.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded my-4">
        <p>{error}</p>
      </div>
    );
  }

  const tasksByStatus = {
    TODO: tasks.filter((task) => task.status === "TODO").length,
    IN_PROGRESS: tasks.filter((task) => task.status === "IN_PROGRESS").length,
    DONE: tasks.filter((task) => task.status === "DONE").length,
  };

  return (
    <div className="space-y-8">
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 sm:truncate">
            Dashboard
          </h2>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <Link
            href="/dashboard/tasks/new"
            className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            Create New Task
          </Link>
        </div>
      </div>

      {/* Task Statistics */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                <svg
                  className="h-6 w-6 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                  To Do
                </dt>
                <dd className="flex items-baseline">
                  <div className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                    {tasksByStatus.TODO}
                  </div>
                </dd>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-yellow-500 rounded-md p-3">
                <svg
                  className="h-6 w-6 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                  In Progress
                </dt>
                <dd className="flex items-baseline">
                  <div className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                    {tasksByStatus.IN_PROGRESS}
                  </div>
                </dd>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                <svg
                  className="h-6 w-6 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                  Completed
                </dt>
                <dd className="flex items-baseline">
                  <div className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                    {tasksByStatus.DONE}
                  </div>
                </dd>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* High Priority Tasks */}
      <div className="bg-white dark:bg-gray-800 shadow overflow-hidden rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">
            High Priority Tasks
          </h3>
          <Link
            href="/dashboard/tasks?priority=HIGH"
            className="text-sm text-blue-600 hover:text-blue-500"
          >
            View all
          </Link>
        </div>
        <div className="border-t border-gray-200 dark:border-gray-700">
          {highPriorityTasks.length > 0 ? (
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {highPriorityTasks.slice(0, 5).map((task) => (
                <li key={task.id} className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-3 w-3 rounded-full bg-red-500"></div>
                      <p className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-100">
                        {task.title}
                      </p>
                    </div>
                    <div className="ml-2 flex-shrink-0 flex">
                      <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100">
                        {task.status.replace("_", " ")}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
              No high priority tasks
            </div>
          )}
        </div>
      </div>

      {/* Upcoming Tasks */}
      <div className="bg-white dark:bg-gray-800 shadow overflow-hidden rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">
            Upcoming Tasks (Next 7 Days)
          </h3>
          <Link
            href="/dashboard/tasks"
            className="text-sm text-blue-600 hover:text-blue-500"
          >
            View all
          </Link>
        </div>
        <div className="border-t border-gray-200 dark:border-gray-700">
          {upcomingTasks.length > 0 ? (
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {upcomingTasks.slice(0, 5).map((task) => (
                <li key={task.id} className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {task.priority === "HIGH" ? (
                        <div className="flex-shrink-0 h-3 w-3 rounded-full bg-red-500"></div>
                      ) : task.priority === "MEDIUM" ? (
                        <div className="flex-shrink-0 h-3 w-3 rounded-full bg-yellow-500"></div>
                      ) : (
                        <div className="flex-shrink-0 h-3 w-3 rounded-full bg-green-500"></div>
                      )}
                      <p className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-100">
                        {task.title}
                      </p>
                    </div>
                    <div className="ml-2 flex-shrink-0 flex">
                      {task.dueDate && (
                        <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100">
                          {new Date(task.dueDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
              No upcoming tasks in the next 7 days
            </div>
          )}
        </div>
      </div>
    </div>
  );
}