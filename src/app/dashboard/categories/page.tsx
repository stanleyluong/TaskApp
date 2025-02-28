"use client";

import { useState, useEffect } from "react";

interface Category {
  id: string;
  name: string;
  createdAt: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/categories");
        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }
        const data = await response.json();
        setCategories(data);
      } catch (err) {
        setError("Failed to load categories. Please try again later.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: newCategoryName }),
      });

      if (!response.ok) {
        throw new Error("Failed to create category");
      }

      const newCategory = await response.json();
      setCategories([...categories, newCategory]);
      setNewCategoryName("");
    } catch (err) {
      setError("Failed to create category. Please try again.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:truncate">
            Categories
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Create and manage categories to organize your tasks
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 text-red-700 dark:text-red-400 p-4 rounded">
          <p>{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* New Category Form */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Create New Category
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Add a new category to organize your tasks more effectively
            </p>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <form onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Category Name
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    required
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                    placeholder="e.g., Work, Personal, Shopping"
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Create a descriptive name for your category
                </p>
              </div>
              <div className="mt-5">
                <button
                  type="submit"
                  disabled={isSubmitting || !newCategoryName.trim()}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating...
                    </>
                  ) : (
                    <>
                      <svg className="-ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Add Category
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Categories List */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              All Categories
              {!isLoading && (
                <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                  ({categories.length})
                </span>
              )}
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              View and manage your task categories
            </p>
          </div>
          {isLoading ? (
            <div className="px-4 py-12 text-center">
              <svg className="animate-spin mx-auto h-8 w-8 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Loading categories...</p>
            </div>
          ) : categories.length === 0 ? (
            <div className="px-4 py-10 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No categories found</p>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Create your first category to organize your tasks!
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {categories.map((category) => (
                <li key={category.id} className="px-4 py-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-150">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{category.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Created on {new Date(category.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button 
                        className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                        title="Edit category"
                      >
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}