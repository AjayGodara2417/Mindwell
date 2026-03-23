"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Calendar,
  Video,
  BookOpen,
  User,
  Settings,
  LogOut,
  BarChart3,
} from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navItems = [
    { href: "/dashboard", icon: Home, label: "Dashboard" },
    { href: "/assessment", icon: BarChart3, label: "Assessment" },
    { href: "/planner", icon: Calendar, label: "Schedule" },
    { href: "/face-diary", icon: Video, label: "Journal" },
    { href: "/resources", icon: BookOpen, label: "Resources" },
    { href: "/profile", icon: User, label: "Profile" },
    { href: "/settings", icon: Settings, label: "Settings" },
  ];

  return (
    <div className="flex min-h-screen bg-[#f6f8f7] text-gray-800">

      {/* Sidebar */}
      <aside className="w-64 bg-[#eef3f1] border-r border-gray-200 flex flex-col justify-between p-6">

        <div>
          {/* Logo */}
          <div className="mb-10">
            <h1 className="text-xl font-semibold text-[#2f5d50]">
              Mindwell
            </h1>
            <p className="text-xs text-gray-500">
              Get fit with AI powered platform
            </p>
          </div>

          {/* Navigation */}
          <nav className="flex flex-col gap-2">
            {navItems.map((item, i) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={i}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition
                  ${isActive
                      ? "bg-white shadow-sm text-[#2f5d50]"
                      : "text-gray-600 hover:bg-white hover:shadow-sm"}
                  `}
                >
                  <Icon size={18} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sign Out */}
        <button className="flex items-center gap-2 text-gray-500 hover:text-red-500 text-sm" onClick={() => {
          localStorage.clear();
          window.location.href = "/login";
        }}>
          <LogOut size={16} />
          Sign Out
        </button>

      </aside>

      {/* Content */}
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}