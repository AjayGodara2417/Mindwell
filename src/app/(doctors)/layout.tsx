"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Settings,
  LogOut,
  Activity,
  ChevronLeft,
  Menu,
  ShieldCheck
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

  const menu = [
    {
      name: "Dashboard",
      href: "/doctor-dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Patients",
      href: "/doctor-dashboard/patient",
      icon: Users,
    },
    {
      name: "Settings",
      href: "/doctorsettings",
      icon: Settings,
    },
  ];

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      
      {/* MOBILE HEADER - Only visible on small screens */}
      <div className="lg:hidden fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-slate-200 z-[40] px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
            <Activity size={18} />
          </div>
          <span className="font-black text-slate-900 uppercase tracking-tight">MindWell</span>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
        >
          {isMobileMenuOpen ? <ChevronLeft /> : <Menu />}
        </button>
      </div>

      {/* SIDEBAR NAVIGATION */}
      <aside className={`
        fixed lg:sticky top-0 h-screen bg-slate-900 z-[50]
        w-72 flex flex-col justify-between transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>
        
        {/* TOP SECTION: Logo & Nav */}
        <div>
          <div className="h-24 flex items-center px-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                <Activity size={22} />
              </div>
              <div>
                <h2 className="text-xl font-black text-white leading-none tracking-tight">MINDWELL</h2>
                <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-[0.2em] mt-1.5">Clinical Portal</p>
              </div>
            </div>
          </div>

          <nav className="p-4 space-y-2">
            {menu.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href || (item.href !== "/doctor-dashboard" && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`
                    flex items-center gap-3 px-5 py-4 rounded-2xl transition-all duration-200 group
                    ${active
                      ? "bg-indigo-600 text-white font-bold shadow-lg shadow-indigo-900/40" 
                      : "text-slate-400 hover:bg-slate-800 hover:text-white"
                    }
                  `}
                >
                  <Icon 
                    size={20} 
                    className={active ? "text-white" : "text-slate-500 group-hover:text-indigo-400"} 
                  />
                  <span className="text-sm tracking-wide">{item.name}</span>
                  {active && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* BOTTOM SECTION: Profile & Logout */}
        <div className="p-6 space-y-6">
          <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700/50">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <ShieldCheck size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white truncate">Welcome Doctor</p>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Verified</p>
                </div>
              </div>
            </div>
            
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest text-rose-400 bg-rose-400/5 hover:bg-rose-400/10 border border-rose-400/20 transition-all"
            >
              <LogOut size={16} />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* MOBILE OVERLAY */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[45] lg:hidden transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col min-h-screen w-full">
        <div className="p-6 md:p-10 lg:p-12 mt-16 lg:mt-0">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>

    </div>
  );
}