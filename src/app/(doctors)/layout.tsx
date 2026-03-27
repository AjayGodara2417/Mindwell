"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  User,
  Settings,
  Stethoscope,
  LogOut,
  Zap,
} from "lucide-react";

export default function DoctorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const menu = [
    {
      name: "Dashboard",
      href: "/doctor-dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "All Patient",
      href: "/doctor-dashboard/patient/", // adjust route
      icon: User,
    },
    {
      name: "Settings",
      href: "/doctorsettings",
      icon: Settings,
    },
  ];

  return (
    <div className="flex min-h-screen bg-[#f6f8f7]">

      {/* SIDEBAR */}
      <aside className="w-72 bg-white border-r flex flex-col justify-between h-screen sticky top-0">

        {/* TOP */}
        <div>

          {/* Logo */}
          <div className="px-6 pt-8 pb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              MindWell
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              The Place to manage your patients
            </p>
          </div>

          {/* Menu */}
          <nav className="px-4 space-y-2">

            {menu.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all
                  ${
                    active
                      ? "bg-[#e6f4f1] text-teal-700 font-medium shadow-sm"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <Icon size={18} />
                  {item.name}
                </Link>
              );
            })}

          </nav>

        </div>

        {/* BOTTOM */}
        <div className="p-4 space-y-4">

          {/* Logout */}
          <button className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-teal-500 to-emerald-400 text-white py-3 rounded-xl shadow-md hover:opacity-90 transition">
            <LogOut size={16} />
            Sign Out
          </button>

          {/* Sign out */}
          <button className="w-full flex items-center gap-2 text-gray-500 hover:text-red-500 transition text-sm">
            
            
          </button>

        </div>

      </aside>

      {/* MAIN */}
      <main className="flex-1 px-6 md:px-10 py-8">
        {children}
      </main>

    </div>
  );
}