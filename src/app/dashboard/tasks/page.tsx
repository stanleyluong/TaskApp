"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface Task {
  id: string;
  title: string;
  description: string | null;
  status: "TODO" | "IN_PROGRESS" | "DONE";
  priority: "LOW" | "MEDIUM" | "HIGH";
  dueDate: string | null;
  category: { id: string; name: string } | null;
  createdAt: string;
  updatedAt: string;
}

interface Category {
  id: string;
  name: string;
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    status: "",
    priority: "",
    categoryId: "",
  });

  const apiBase = process.env.NEXT_PUBLIC_API_URL || '';

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch tasks with filters
        const queryParams = new URLSearchParams();
        if (filters.status) queryParams.append("status", filters.status);
        if (filters.priority) queryParams.append("priority", filters.priority);
        if (filters.categoryId) queryParams.append("categoryId", filters.categoryId);
        
        const tasksResponse = await fetch(`${apiBase}/api/tasks?${queryParams.toString()}`);
        if (!tasksResponse.ok) throw new Error("Failed to fetch tasks");
        const tasksData = await tasksResponse.json();
        setTasks(tasksData);

        // Fetch categories for filter
        const categoriesResponse = await fetch(`${apiBase}/api/categories`);
        if (!categoriesResponse.ok) throw new Error("Failed to fetch categories");
        const categoriesData = await categoriesResponse.json();
        setCategories(categoriesData);
      } catch (err) {
        setError("Failed to load data. Please try again later.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [filters, apiBase]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateStatus = async (taskId: string, newStatus: "TODO" | "IN_PROGRESS" | "DONE") => {
    try {
      const taskToUpdate = tasks.find(task => task.id === taskId);
      if (!taskToUpdate) return;

      const response = await fetch(`${apiBase}/api/tasks/${taskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...taskToUpdate, status: newStatus }),
      });

      if (!response.ok) throw new Error("Failed to update task");

      setTasks(tasks.map(task => 
        task.id === taskId ? { ...task, status: newStatus } : task
      ));
    } catch (err) {
      console.error("Error updating task status:", err);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm("Are you sure you want to delete this task?")) return;

    try {
      const response = await fetch(`${apiBase}/api/tasks/${taskId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete task");

      setTasks(tasks.filter(task => task.id !== taskId));
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  function getPriorityColor(priority: string) {
    switch (priority) {
      case "HIGH":
        return "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100";
      case "MEDIUM":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100";
      case "LOW":
        return "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100";
    }
  }

  function getStatusColor(status: string) {
    switch (status) {
      case "TODO":
        return "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100";
      case "IN_PROGRESS":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100";
      case "DONE":
        return "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100";
    }
  }

  return (
    <div className="space-y-8">
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 sm:truncate">
            Tasks
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

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 py-2 pl-3 pr-10 text-base focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700"
            >
              <option value="">All Statuses</option>
              <option value="TODO">To Do</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="DONE">Done</option>
            </select>
          </div>

          <div>
            <label htmlFor="priority" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Priority
            </label>
            <select
              id="priority"
              name="priority"
              value={filters.priority}
              onChange={handleFilterChange}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 py-2 pl-3 pr-10 text-base focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700"
            >
              <option value="">All Priorities</option>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
          </div>

          <div>
            <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Category
            </label>
            <select
              id="categoryId"
              name="categoryId"
              value={filters.categoryId}
              onChange={handleFilterChange}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 py-2 pl-3 pr-10 text-base focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <p>Loading tasks...</p>
        </div>
      ) : error ? (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded my-4">
          <p>{error}</p>
        </div>
      ) : tasks.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden rounded-lg">
          <div className="px-4 py-5 sm:p-6 text-center">
            <p className="text-gray-500 dark:text-gray-400">No tasks found</p>
            <Link
              href="/dashboard/tasks/new"
              className="mt-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
            >
              Create your first task
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
          <ul role="list" className="divide-y divide-gray-200 dark:divide-gray-700">
            {tasks.map((task) => (
              <li key={task.id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <p className="text-sm font-medium text-blue-600 truncate">
                        {task.title}
                      </p>
                      <div className="ml-2 flex-shrink-0 flex">
                        <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </p>
                        <p className={`ml-1 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(task.status)}`}>
                          {task.status.replace("_", " ")}
                        </p>
                      </div>
                    </div>
                    <div className="ml-2 flex-shrink-0 flex space-x-2">
                      {task.status !== "DONE" && (
                        <button
                          onClick={() => handleUpdateStatus(task.id, "DONE")}
                          className="text-sm text-green-600 hover:text-green-500"
                        >
                          Mark Done
                        </button>
                      )}
                      {task.status === "TODO" && (
                        <button
                          onClick={() => handleUpdateStatus(task.id, "IN_PROGRESS")}
                          className="text-sm text-yellow-600 hover:text-yellow-500"
                        >
                          Start
                        </button>
                      )}
                      <Link
                        href={`/dashboard/tasks/${task.id}`}
                        className="text-sm text-blue-600 hover:text-blue-500"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="text-sm text-red-600 hover:text-red-500"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <p className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        {task.description ? task.description.substring(0, 100) + (task.description.length > 100 ? '...' : '') : 'No description'}
                      </p>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400 sm:mt-0">
                      {task.category && (
                        <p>
                          Category: {task.category.name}
                        </p>
                      )}
                      {task.dueDate && (
                        <p className="ml-2">
                          Due: {new Date(task.dueDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}