"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <div className="flex justify-between items-center px-8 py-4 bg-white shadow-sm">
      <h1 className="text-lg font-semibold text-green-700">MindWell</h1>
      <div className="flex gap-6 text-sm text-gray-600">
        <Link href="#" className="hover:text-gray-900">
            About
          </Link>
          <Link href="#" className="hover:text-gray-900">
            Features
          </Link>
          <Link href="#" className="hover:text-gray-900">
            Resources
          </Link>
      </div>
      <div className="flex gap-4">
        <Link
            href="/signup"
            className="px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
          >
            Sign Up
          </Link>
          <Link
            href="/login"
            className="px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
          >
            Log In
          </Link>
      </div>
    </div>
  );
  return (
    <nav className="w-full border-b bg-white">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-100">
            {/* simple logo icon */}
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              className="text-blue-600"
            >
              <path
                d="M12 2C9 6 5 7 5 12c0 4 3 7 7 10 4-3 7-6 7-10 0-5-4-6-7-10z"
                stroke="currentColor"
                strokeWidth="2"
                fill="currentColor"
              />
            </svg>
          </div>
          <span className="text-lg font-semibold text-gray-800">
            MindWell
          </span>
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-8 text-gray-600 font-medium">
          <Link href="#" className="hover:text-gray-900">
            About
          </Link>
          <Link href="#" className="hover:text-gray-900">
            Features
          </Link>
          <Link href="#" className="hover:text-gray-900">
            Resources
          </Link>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          
          <Link
            href="/signup"
            className="px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
          >
            Sign Up
          </Link>
          <Link
            href="/login"
            className="px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
          >
            Log In
          </Link>
        </div>

      </div>
    </nav>
  );
}