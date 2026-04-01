"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Users, ArrowRight, Filter } from "lucide-react";

type Patient = {
  id: string;
  full_name: string;
  email: string;
  symptoms: string;
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
          setPatients(data.patients);
        }
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };

    fetchPatients();
  }, []);

  const filteredPatients = patients.filter((p) =>
    p.full_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Patient Directory</h1>
          <p className="text-slate-500 text-sm mt-1">Manage and view all assigned patient records.</p>
        </div>
        <div className="flex items-center gap-3">
           <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
            <Filter size={16} /> Filter
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all">
            <Users size={16} /> Add Patient
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-2xl">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
        <input
          placeholder="Search by patient name or email..."
          className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none shadow-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Patient Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          // Skeleton Loading State
          [1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm h-48 animate-pulse">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-slate-200 rounded-full"></div>
                <div className="space-y-2">
                  <div className="h-4 w-32 bg-slate-200 rounded"></div>
                  <div className="h-3 w-24 bg-slate-200 rounded"></div>
                </div>
              </div>
              <div className="h-3 w-full bg-slate-100 rounded mt-4"></div>
              <div className="h-3 w-2/3 bg-slate-100 rounded mt-2"></div>
            </div>
          ))
        ) : filteredPatients.length === 0 ? (
          <div className="col-span-full text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-50 rounded-full mb-4">
              <Users className="text-slate-400" size={32} />
            </div>
            <h3 className="text-lg font-semibold text-slate-700">No patients found</h3>
            <p className="text-slate-500 text-sm mt-1">Try adjusting your search terms.</p>
          </div>
        ) : (
          filteredPatients.map((p) => (
            <div
              key={p.id}
              onClick={() => router.push(`/doctor-dashboard/patient/${p.email}`)}
              className="group bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-blue-200 cursor-pointer transition-all duration-300 flex flex-col justify-between h-full"
            >
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-linear-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-md shadow-blue-200">
                      {p.full_name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                        {p.full_name}
                      </h3>
                      <p className="text-xs text-slate-500 font-medium">{p.email}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-lg p-3 mb-4">
                  <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">Primary Symptoms</p>
                  <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">
                    {p.symptoms || "No symptoms recorded"}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-auto">
                <span className="text-xs font-medium text-slate-400">Last Active: 2h ago</span>
                <div className="flex items-center gap-1 text-blue-600 text-sm font-semibold group-hover:translate-x-1 transition-transform">
                  View Profile <ArrowRight size={16} />
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}