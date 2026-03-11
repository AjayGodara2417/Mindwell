import Link from "next/link";
import { Home, Calendar, Video, BookOpen, User, Settings, LogOut } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-linear-to-br from-[#071421] to-[#0a2033] text-white">

      {/* Sidebar */}
      <aside className="w-64 bg-[#081a2f] border-r border-white/5 flex flex-col justify-between p-6">

        <div>
          {/* Logo */}
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center font-bold">
              M
            </div>
            <div>
              <p className="font-semibold text-lg">MindWell</p>
              <p className="text-xs text-gray-400">Mental Wellness</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex flex-col gap-2 text-gray-300">

            <Link href="/dashboard" className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-500/10">
              <Home size={18} /> Home
            </Link>

            <Link href="/planner" className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-500/10">
              <Calendar size={18} /> Planner
            </Link>

            <Link
              href="face-diary"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-500/20"
            >
              <Video size={18} /> Face Diary
            </Link>

            <Link href="resources" className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-500/10">
              <BookOpen size={18} /> Resources
            </Link>

            <Link href="profile" className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-500/10">
              <User size={18} /> Profile
            </Link>

            <Link href="settings" className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-500/10">
              <Settings size={18} /> Settings
            </Link>

          </nav>
        </div>

        {/* Sign out */}
        <button className="flex items-center gap-3 text-gray-400 hover:text-white">
          <LogOut size={18} />
          Sign Out
        </button>

      </aside>

      {/* Page Content */}
      <main className="flex-1 flex items-center justify-center p-10">
        {children}
      </main>
    </div>
  );
}