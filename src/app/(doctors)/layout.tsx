"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  User,
  Settings,
  Stethoscope,
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
      name: "Profile",
      href: "/doctor-dashboard/doctorProfile",
      icon: User,
    },
    {
      name: "Settings",
      href: "/doctor-dashboard/doctorSettings",
      icon: Settings,
    },
  ];

  return (
    <div className="flex min-h-full bg-gray-50">

      {/* Sidebar */}

      <aside className="w-64 bg-white border-r hidden md:flex flex-col">

        {/* Logo */}

        <div className="p-6 border-b flex items-center gap-2">
          <Stethoscope className="text-blue-600" />
          <h2 className="text-xl font-bold text-blue-600">
            MindWell
          </h2>
        </div>

        {/* Menu */}

        <nav className="flex-1 p-4 space-y-2">

          {menu.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 p-3 rounded-lg transition
                ${
                  active
                    ? "bg-blue-50 text-blue-600 font-medium"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Icon size={18} />
                {item.name}
              </Link>
            );
          })}

        </nav>

        {/* Footer */}

        <div className="p-4 border-t text-xs text-gray-400">
          Doctor Panel v1.0
        </div>

      </aside>

      {/* Main Content */}

      <main className="flex-1 px-10">
        {children}
      </main>

    </div>
  );
}