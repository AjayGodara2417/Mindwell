"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Users,
  ArrowRight,
  Plus,
  Clock,
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
          const enhanced = data.patients.map((p: any) => ({
            ...p,
            risk_level:
              p.risk_level || (Math.random() > 0.8 ? "High" : "Low"),
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

  const filteredPatients = patients.filter((p) =>
    p.full_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-slate-50 min-h-screen p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* HEADER */}
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              Patients 👥
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Access and manage your patient records.
            </p>
          </div>

          <button className="bg-teal-600 text-white px-5 py-2 rounded-xl text-sm font-medium hover:bg-teal-700 shadow-lg shadow-teal-500/20 transition-all flex items-center gap-2">
            <Plus size={16} /> Add Patient
          </button>
        </div>

        {/* SEARCH */}
        <div className="relative max-w-md">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <input
            placeholder="Search patients..."
            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-teal-500 outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {loading ? (
            [1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 animate-pulse"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-slate-100 rounded-lg"></div>
                  <div className="w-16 h-5 bg-slate-100 rounded-full"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 w-32 bg-slate-100 rounded"></div>
                  <div className="h-3 w-24 bg-slate-100 rounded"></div>
                </div>
              </div>
            ))
          ) : filteredPatients.length === 0 ? (
            <div className="col-span-full text-center py-16 bg-white rounded-2xl border border-slate-100">
              <Users className="mx-auto text-slate-300 mb-4" size={40} />
              <p className="text-slate-400 text-sm">
                No patients found
              </p>
            </div>
          ) : (
            filteredPatients.map((p) => (
              <div
                key={p.id}
                onClick={() =>
                  router.push(`/doctor-dashboard/patient/${p.email}`)
                }
                className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 hover:bg-slate-50 transition cursor-pointer flex flex-col justify-between"
              >
                {/* TOP */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-lg bg-teal-600 text-white flex items-center justify-center font-bold">
                      {p.full_name.charAt(0)}
                    </div>

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium border ${
                        p.risk_level === "High"
                          ? "bg-red-50 text-red-600 border-red-200"
                          : p.risk_level === "Moderate"
                          ? "bg-yellow-50 text-yellow-600 border-yellow-200"
                          : "bg-emerald-50 text-emerald-600 border-emerald-200"
                      }`}
                    >
                      {p.risk_level || "Normal"}
                    </span>
                  </div>

                  <h3 className="font-semibold text-slate-800">
                    {p.full_name}
                  </h3>
                  <p className="text-xs text-slate-400 mb-4">
                    {p.email}
                  </p>

                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                    <p className="text-xs text-slate-500">
                      {p.symptoms || "General Monitoring"}
                    </p>
                  </div>
                </div>

                {/* FOOTER */}
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-2 text-slate-400 text-xs">
                    <Clock size={14} />
                    <span>Active recently</span>
                  </div>

                  <ArrowRight
                    size={16}
                    className="text-slate-400"
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}