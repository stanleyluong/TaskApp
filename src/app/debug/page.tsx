"use client";

import AuthTestComponent from "@/components/AuthTestComponent";
import Link from "next/link";
import { useState } from "react";

export default function DebugPage() {
  const [testResult, setTestResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const testAuth = async () => {
    setIsLoading(true);
    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL || '';
      const response = await fetch(`${apiBase}/api/tasks`, {
        credentials: "include",
      });
      
      const status = response.status;
      let text;
      
      try {
        text = await response.text();
      } catch (e) {
        text = "Could not read response body";
      }
      
      setTestResult(`
        Status: ${status}
        Response: ${text}
      `);
    } catch (error) {
      setTestResult(`Error: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-4">Authentication Debug</h1>
        
        <div className="space-y-6">
          <AuthTestComponent />
          
          <div className="border-t pt-4">
            <h2 className="text-xl font-bold mb-2">Test Authentication</h2>
            <button 
              onClick={testAuth}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? "Testing..." : "Test API Authentication"}
            </button>
            
            {testResult && (
              <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-900 rounded">
                <h3 className="font-bold mb-2">Test Result:</h3>
                <pre className="whitespace-pre-wrap text-sm">{testResult}</pre>
              </div>
            )}
          </div>
          
          <div className="border-t pt-4">
            <h2 className="text-xl font-bold mb-2">Navigation Links</h2>
            <div className="flex space-x-4">
              <Link 
                href="/login" 
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Login Page
              </Link>
              <Link 
                href="/register" 
                className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
              >
                Register Page
              </Link>
              <Link 
                href="/dashboard" 
                className="px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700"
              >
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}