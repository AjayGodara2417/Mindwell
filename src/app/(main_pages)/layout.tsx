import Link from "next/link";
import {
  Home,
  Calendar,
  Video,
  BookOpen,
  User,
  Settings,
  LogOut,
  BarChart3
} from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-100 text-gray-800">

      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col justify-between p-6">

        <div>
          {/* Logo */}
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
              M
            </div>

            <div>
              <p className="font-semibold text-lg text-gray-800">MindWell</p>
              <p className="text-xs text-gray-500">Mental Wellness</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex flex-col gap-2">

            <Link
              href="/dashboard"
              className="flex items-center gap-3 p-3 rounded-lg text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition"
            >
              <Home size={18} /> Home
            </Link>

            <Link
              href="/planner"
              className="flex items-center gap-3 p-3 rounded-lg text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition"
            >
              <Calendar size={18} /> Planner
            </Link>

            <Link
              href="/face-diary"
              className="flex items-center gap-3 p-3 rounded-lg text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition"
            >
              <Video size={18} /> Face Diary
            </Link>

            <Link
              href="/stats"
              className="flex items-center gap-3 p-3 rounded-lg text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition"
            >
              <BarChart3 size={18} /> Stats
            </Link>

            <Link
              href="/resources"
              className="flex items-center gap-3 p-3 rounded-lg text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition"
            >
              <BookOpen size={18} /> Resources
            </Link>

            <Link
              href="/profile"
              className="flex items-center gap-3 p-3 rounded-lg text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition"
            >
              <User size={18} /> Profile
            </Link>

            <Link
              href="/settings"
              className="flex items-center gap-3 p-3 rounded-lg text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition"
            >
              <Settings size={18} /> Settings
            </Link>

          </nav>
        </div>

        {/* Sign Out */}
        <button className="flex items-center gap-3 text-gray-500 hover:text-red-500 transition">
          <LogOut size={18} />
          Sign Out
        </button>

      </aside>

      {/* Page Content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>

    </div>
  );
}