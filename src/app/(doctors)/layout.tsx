"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  Stethoscope,
} from "lucide-react";
import { useState } from "react";

export default function DoctorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { href: "/doctor-dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/doctor-dashboard/patient", icon: Users, label: "Patients" },
    { href: "/doctorsettings", icon: Settings, label: "Settings" },
  ];

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800">

      {/* MOBILE HEADER */}
      <div className="md:hidden fixed top-0 w-full bg-white border-b border-slate-200 z-30 px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
            <Stethoscope size={18} />
          </div>
          <span className="font-bold text-lg text-slate-800">MindWell</span>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* SIDEBAR */}
      <aside
        className={`
        fixed md:sticky top-0 h-screen bg-white border-r border-slate-200 z-20
        w-72 flex flex-col justify-between transition-transform duration-300
        ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}
      >

        {/* TOP */}
        <div>
          {/* LOGO */}
          <div className="h-20 flex items-center px-6 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
                <Stethoscope size={20} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-800">MindWell</h2>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider">
                  Doctor Portal
                </p>
              </div>
            </div>
          </div>

          {/* NAV */}
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl transition-all
                    ${active
                      ? "bg-indigo-50 text-indigo-700 font-semibold"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"}
                  `}
                >
                  <Icon
                    size={20}
                    className={
                      active ? "text-indigo-600" : "text-slate-400"
                    }
                  />
                  <span className="text-sm">{item.label}</span>

                  {active && (
                    <div className="ml-auto w-1.5 h-1.5 bg-indigo-600 rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* BOTTOM */}
        <div className="p-4 border-t border-slate-100 space-y-4">

          {/* DOCTOR INFO */}
          <div className="flex items-center gap-3 px-2">
            <div className="w-9 h-9 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs">
              DR
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-slate-700">
                Doctor
              </p>
              <p className="text-xs text-slate-400">
                Clinical Access
              </p>
            </div>
          </div>

          {/* LOGOUT */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* OVERLAY */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-10 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* MAIN */}
      <main className="flex-1 pt-16 md:pt-0">
        <div className="p-6 md:p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}