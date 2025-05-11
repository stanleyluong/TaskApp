"use client";

import { useEffect, useState } from "react";

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
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      setError(null); // Clear previous errors
      try {
        const response = await fetch('/api/categories', { credentials: 'include' });
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || "Failed to fetch categories");
        }
        const data = await response.json();
        setCategories(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load categories. Please try again later.");
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
    setError(null);
    try {
      const isEditing = editingCategory !== null;
      const payload = isEditing 
        ? { name: newCategoryName, id: editingCategory.id }
        : { name: newCategoryName };
        
      const response = await fetch('/api/categories', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || (isEditing ? "Failed to update category" : "Failed to create category"));
      }

      const responseData = await response.json();
      
      if (isEditing) {
        setCategories(categories.map(cat => 
          cat.id === editingCategory.id ? responseData : cat
        ));
        setEditingCategory(null);
      } else {
        setCategories([...categories, responseData]);
      }
      
      setNewCategoryName("");
    } catch (err) {
      setError(err instanceof Error ? err.message : (editingCategory !== null 
        ? "Failed to update category. Please try again." 
        : "Failed to create category. Please try again.")
      );
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setNewCategoryName(category.name);
    setError(null);
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (!window.confirm("Are you sure you want to delete this category? This action cannot be undone.")) {
      return;
    }
    setError(null);
    // Optimistically update UI or show a loading state for the specific item if preferred
    // For simplicity, we'll refetch or filter after success/failure

    try {
      const response = await fetch(`/api/categories/${categoryId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to delete category");
      }

      // Remove category from state
      setCategories(categories.filter(cat => cat.id !== categoryId));
      // Optionally, show a success message

    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete category. Please try again.");
      console.error('Error deleting category:', err);
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
              {editingCategory ? "Edit Category" : "Create New Category"}
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {editingCategory 
                ? "Update an existing category" 
                : "Add a new category to organize your tasks more effectively"
              }
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
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full text-base px-4 py-2.5 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                    placeholder="e.g., Work, Personal, Shopping"
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Create a descriptive name for your category
                </p>
              </div>
              <div className="mt-5">
                <div className="flex space-x-3">
                  {editingCategory && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingCategory(null);
                        setNewCategoryName("");
                      }}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Cancel
                    </button>
                  )}
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
                        {editingCategory ? "Updating..." : "Creating..."}
                      </>
                    ) : (
                      <>
                        <svg className="-ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          {editingCategory ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          )}
                        </svg>
                        {editingCategory ? "Update Category" : "Add Category"}
                      </>
                    )}
                  </button>
                </div>
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
                        onClick={() => handleEdit(category)}
                      >
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button 
                        className="text-red-500 hover:text-red-700 dark:hover:text-red-400"
                        title="Delete category"
                        onClick={() => handleDeleteCategory(category.id)}
                      >
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
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