"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Users,
  ArrowRight,
  Filter,
  Plus,
  Activity,
  Clock,
  MoreHorizontal
} from "lucide-react";

type Patient = {
  id: string;
  full_name: string;
  email: string;
  symptoms: string;
  risk_level?: "High" | "Moderate" | "Low";
};

export default function PatientsPage() {
  const router = useRouter();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const doctorId = localStorage.getItem("doctorId");

    const fetchPatients = async () => {
      try {
        const res = await fetch(`/api/doctor-patients?doctor_id=${doctorId}`);
        const data = await res.json();
        if (data.success) {
          // Assigning random risk levels for the UI demonstration if not in DB
          const enhanced = data.patients.map((p: any) => ({
            ...p,
            risk_level: p.risk_level || (Math.random() > 0.8 ? "High" : "Low")
          }));
          setPatients(enhanced);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  // ✅ Correct approach
  const filteredPatients = patients.filter((p) =>
    p.full_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">

      {/* --- PAGE HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-2">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-[10px] font-black uppercase tracking-[0.15em]">
            <Activity size={12} /> Clinical Roster
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Patient Directory</h1>
          <p className="text-slate-500 font-medium">Access and manage comprehensive medical profiles.</p>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-5 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm">
            <Filter size={18} />
            <span>Advanced Filters</span>
          </button>
          <button className="flex items-center gap-2 px-6 py-3.5 bg-indigo-600 text-white rounded-2xl text-sm font-bold hover:bg-indigo-700 shadow-xl shadow-indigo-200 transition-all active:scale-95">
            <Plus size={20} />
            <span>Add Patient</span>
          </button>
        </div>
      </div>

      {/* --- SEARCH BAR SECTION --- */}
      <div className="relative group max-w-3xl">
        <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
          <Search className="text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
        </div>
        <input
          placeholder="Search clinical records by name or email ID..."
          className="w-full pl-14 pr-6 py-5 bg-white border border-slate-200 rounded-[1.5rem] text-sm font-medium focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-600 transition-all outline-none shadow-sm"
          value={search} // Controlled component
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* --- PATIENT GRID --- */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          // Professional Skeleton state
          [1, 2, 3].map((i) => (
            <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm h-64 animate-pulse">
              <div className="flex justify-between items-start mb-6">
                <div className="w-14 h-14 bg-slate-100 rounded-2xl"></div>
                <div className="w-8 h-4 bg-slate-100 rounded-lg"></div>
              </div>
              <div className="space-y-3">
                <div className="h-5 w-40 bg-slate-100 rounded-lg"></div>
                <div className="h-4 w-28 bg-slate-100 rounded-lg"></div>
              </div>
            </div>
          ))
        ) : filteredPatients.length === 0 ? (
          <div className="col-span-full text-center py-24 bg-white rounded-[3rem] border border-dashed border-slate-200">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-50 rounded-full mb-6">
              <Users className="text-slate-300" size={40} />
            </div>
            <h3 className="text-xl font-black text-slate-800 tracking-tight">No clinical matches</h3>
            <p className="text-slate-500 font-medium mt-2">Adjust your query to find the desired record.</p>
          </div>
        ) : (
          filteredPatients.map((p) => (
            <div
              key={p.id}
              onClick={() => router.push(`/doctor-dashboard/patient/${p.email}`)}
              className="group bg-white p-8 rounded-[2.5rem] border border-slate-200/60 shadow-sm hover:shadow-2xl hover:shadow-indigo-500/5 hover:border-indigo-200 cursor-pointer transition-all duration-500 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between mb-8">
                  <div className="w-16 h-16 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black text-2xl group-hover:bg-indigo-600 group-hover:scale-110 transition-all duration-500 shadow-lg">
                    {p.full_name.charAt(0)}
                  </div>
                  <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 ${p.risk_level === "High" ? "bg-rose-100 text-rose-700" : "bg-emerald-100 text-emerald-700"
                    }`}>
                    <span className={`w-1 h-1 rounded-full ${p.risk_level === "High" ? "bg-rose-500 animate-pulse" : "bg-emerald-500"}`} />
                    {p.risk_level || "Normal"}
                  </div>
                </div>

                <div className="space-y-1 mb-6">
                  <h3 className="text-xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors tracking-tight">
                    {p.full_name}
                  </h3>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{p.email}</p>
                </div>

                <div className="bg-slate-50 rounded-2xl p-4 mb-4 border border-slate-100 group-hover:bg-indigo-50/50 transition-colors">
                  <p className="text-[9px] text-slate-400 font-black uppercase tracking-[0.2em] mb-2">Primary Diagnosis</p>
                  <p className="text-sm text-slate-700 font-bold line-clamp-2 leading-relaxed">
                    {p.symptoms || "General Health Monitoring"}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-slate-100 mt-4">
                <div className="flex items-center gap-2 text-slate-400">
                  <Clock size={14} />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Active 2h ago</span>
                </div>
                <div className="w-10 h-10 rounded-full border border-slate-100 flex items-center justify-center text-slate-300 group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600 transition-all duration-300 group-hover:translate-x-1">
                  <ArrowRight size={18} />
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}