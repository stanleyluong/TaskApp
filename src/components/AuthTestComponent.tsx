"use client";

import { useState, useEffect } from "react";

export default function AuthTestComponent() {
  const [authStatus, setAuthStatus] = useState<string>("Checking...");
  const [tokenContent, setTokenContent] = useState<string | null>(null);
  const [cookies, setCookies] = useState<string>("");

  useEffect(() => {
    // Check for token in cookies
    const allCookies = document.cookie;
    setCookies(allCookies);
    
    // Create a simple test request to check auth status
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/tasks", {
          credentials: "include"
        });
        
        if (response.ok) {
          setAuthStatus("Authenticated");
        } else {
          setAuthStatus("Not authenticated");
        }
        
        // Try to decode token if it exists
        const tokenCookie = document.cookie
          .split("; ")
          .find(row => row.startsWith("token="));
          
        if (tokenCookie) {
          const token = tokenCookie.split("=")[1];
          try {
            // We can't directly decode JWT on client-side without a library
            // Just showing it's there
            setTokenContent(`Token exists (${token.substring(0, 15)}...)`);
          } catch (e) {
            setTokenContent("Error decoding token");
          }
        } else {
          setTokenContent("No token found");
        }
      } catch (error) {
        setAuthStatus(`Error checking auth: ${error}`);
      }
    };
    
    checkAuth();
  }, []);

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow mt-4">
      <h2 className="text-lg font-bold mb-4">Authentication Debug</h2>
      
      <div className="space-y-4">
        <div>
          <p className="font-medium">Auth Status:</p>
          <p className={`${authStatus === "Authenticated" ? "text-green-600" : "text-red-600"}`}>
            {authStatus}
          </p>
        </div>
        
        <div>
          <p className="font-medium">Token:</p>
          <p>{tokenContent || "None"}</p>
        </div>
        
        <div>
          <p className="font-medium">All Cookies:</p>
          <pre className="bg-gray-100 dark:bg-gray-900 p-2 rounded text-xs overflow-x-auto">
            {cookies || "No cookies found"}
          </pre>
        </div>
      </div>
    </div>
  );
}