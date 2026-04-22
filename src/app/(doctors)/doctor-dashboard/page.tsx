"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ArrowRight,
  Users,
  Activity,
  Plus,
  AlertCircle,
  BrainCircuit,
  Filter,
  MoreVertical,
} from "lucide-react";

type Patient = {
  id: string;
  full_name: string;
  email: string;
  symptoms: string;
  risk_level: "High" | "Moderate" | "Low";
  last_checkin: string;
};

export default function DoctorDashboard() {
  const router = useRouter();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const doctorId = typeof window !== 'undefined' ? localStorage.getItem("doctorId") : null;

    const fetchPatients = async () => {
      try {
        // Simulating a clinical API fetch with risk-level mapping
        const res = await fetch(`/api/doctor-patients?doctor_id=${doctorId}`);
        const data = await res.json();
        
        // Mocking additional clinical data if not present in API
        const enhancedData = data.patients.map((p: any) => ({
          ...p,
          risk_level: p.risk_level || (Math.random() > 0.7 ? "High" : "Low"),
          last_checkin: "2 hours ago"
        }));

        if (data.success) {
          setPatients(enhancedData);
        }
      } catch (error) {
        console.error("Failed to fetch patients", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  const filteredPatients = patients.filter((p) =>
    p.full_name.toLowerCase().includes(search.toLowerCase())
  );

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-slate-50 flex flex-col"
    >
      <main className="flex-1 p-4 md:p-10 lg:p-12 overflow-y-auto">
        <div className="max-w-7xl mx-auto space-y-10">
          
          {/* HEADER AREA */}
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">System Live</span>
              </div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tight">Clinical Insights</h1>
              <p className="text-slate-500 font-medium">Analyzing behavioral patterns for {patients.length} patients.</p>
            </div>
            
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-4 rounded-2xl font-bold transition-all flex items-center gap-3 shadow-xl shadow-indigo-200 group"
            >
              <div className="bg-white/20 p-1 rounded-lg">
                <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
              </div>
              Onboard New Patient
            </motion.button>
          </header>

          {/* STATS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard 
              title="Active Roster" 
              value={patients.length.toString()} 
              icon={<Users className="text-indigo-600" />} 
              bg="bg-indigo-50"
              trend="+2 this week"
            />
            <StatCard 
              title="Critical Priority" 
              value={patients.filter(p => p.risk_level === "High").length.toString()} 
              icon={<AlertCircle className="text-rose-600" />} 
              bg="bg-rose-50"
              trend="Requires Review"
            />
            <StatCard 
              title="Avg. Wellness Score" 
              value="72%" 
              icon={<BrainCircuit className="text-emerald-600" />} 
              bg="bg-emerald-50"
              trend="System Average"
            />
          </div>

          {/* PATIENT DIRECTORY */}
          <section className="space-y-6">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                Patient Directory
                <span className="bg-slate-200 text-slate-600 text-[10px] px-2 py-0.5 rounded-full uppercase">Live</span>
              </h2>
              <button className="text-slate-400 hover:text-indigo-600 flex items-center gap-2 text-sm font-bold transition-colors">
                <Filter size={16} /> Filter
              </button>
            </div>

            <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200/60 overflow-hidden backdrop-blur-sm">
              {/* Toolbar */}
              <div className="px-8 py-6 border-b border-slate-100 flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:w-96">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    placeholder="Search by name, ID or status..."
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-600 transition-all outline-none"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  {["All", "High Risk", "Recently Added"].map((tab) => (
                    <button key={tab} className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-50 transition-colors">
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              {/* Patient List */}
              <div className="p-2 md:p-4">
                <AnimatePresence mode="popLayout">
                  {loading ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-32 text-center space-y-4">
                      <Activity className="mx-auto w-8 h-8 text-indigo-500 animate-spin" />
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Decrypting Clinical Records</p>
                    </motion.div>
                  ) : filteredPatients.length === 0 ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-32 text-center text-slate-400 font-bold italic">
                      No clinical matches found in current view.
                    </motion.div>
                  ) : (
                    <div className="grid gap-2">
                      {filteredPatients.map((p) => (
                        <motion.div
                          layout
                          key={p.id}
                          variants={itemVariants}
                          onClick={() => router.push(`/doctor-dashboard/patient/${p.email}`)}
                          className="group grid grid-cols-1 md:grid-cols-4 items-center p-4 rounded-2xl hover:bg-indigo-50/40 transition-all duration-300 cursor-pointer border border-transparent hover:border-indigo-100"
                        >
                          {/* Profile Column */}
                          <div className="flex items-center gap-4 col-span-1">
                            <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black group-hover:scale-110 transition-transform">
                              {p.full_name.charAt(0)}
                            </div>
                            <div className="min-w-0">
                              <h4 className="font-bold text-slate-900 truncate group-hover:text-indigo-600 transition-colors">
                                {p.full_name}
                              </h4>
                              <p className="text-[10px] text-slate-400 font-medium truncate uppercase tracking-tighter">{p.email}</p>
                            </div>
                          </div>

                          {/* Symptoms Column */}
                          <div className="hidden md:flex flex-col col-span-1">
                            <span className="text-[9px] font-black uppercase text-slate-300 tracking-widest mb-1">Primary Condition</span>
                            <span className="text-xs font-bold text-slate-600 truncate">{p.symptoms || "Routine Monitoring"}</span>
                          </div>

                          {/* Priority/Status Column */}
                          <div className="hidden md:flex flex-col col-span-1 items-center">
                            <span className="text-[9px] font-black uppercase text-slate-300 tracking-widest mb-1">Risk Status</span>
                            <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 ${
                              p.risk_level === "High" ? "bg-rose-100 text-rose-700" : "bg-emerald-100 text-emerald-700"
                            }`}>
                              <span className={`w-1 h-1 rounded-full ${p.risk_level === "High" ? "bg-rose-500 animate-pulse" : "bg-emerald-500"}`} />
                              {p.risk_level}
                            </div>
                          </div>

                          {/* Action Column */}
                          <div className="flex items-center justify-end gap-4 col-span-1">
                            <div className="text-right hidden lg:block">
                              <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Last Entry</p>
                              <p className="text-xs font-bold text-slate-500">{p.last_checkin}</p>
                            </div>
                            <div className="p-2 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-all text-slate-300">
                              <ArrowRight size={18} />
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </section>
        </div>
      </main>
    </motion.div>
  );
}

function StatCard({ title, value, icon, bg, trend }: any) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="bg-white p-8 rounded-[2.5rem] border border-slate-200/60 flex items-center justify-between group shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all"
    >
      <div className="space-y-1">
        <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">{title}</p>
        <div className="flex items-baseline gap-2">
          <h3 className="text-4xl font-black text-slate-900 tracking-tighter">{value}</h3>
          <span className="text-[10px] font-bold text-slate-400 italic">{trend}</span>
        </div>
      </div>
      <div className={`w-14 h-14 ${bg} rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-3`}>
        {icon}
      </div>
    </motion.div>
  );
}