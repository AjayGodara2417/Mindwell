"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  ArrowRight,
  Users,
  Activity,
  DollarSign,
  FileCheck,
  Plus,
} from "lucide-react";

type Patient = {
  id: string;
  full_name: string;
  email: string;
  symptoms: string;
};

export default function DoctorDashboard() {
  const router = useRouter();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulating auth check - in real app use NextAuth or similar
    const token = localStorage.getItem("token");
    const doctorId = localStorage.getItem("doctorId");

    // Mocking data if no token for demonstration purposes if you are testing locally without backend
    // Remove this block in production
    if (!token) {
       // router.push("/login"); 
       // return;
    }

    const fetchPatients = async () => {
      try {
        // Replace with your actual API endpoint
        const res = await fetch(`/api/doctor-patients?doctor_id=${doctorId}`);
        const data = await res.json();

        if (data.success) {
          setPatients(data.patients);
        }
      } catch (error) {
        console.error("Failed to fetch patients", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, [router]);

  const filteredPatients = patients.filter((p) =>
    p.full_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto space-y-8">

      {/* PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Dashboard Overview
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Welcome back, heres whats happening today.
          </p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-full text-sm font-medium shadow-lg shadow-blue-500/30 transition-all flex items-center gap-2">
          <Plus size={18} />
          New Patient
        </button>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Patients" 
          value={patients.length.toString()} 
          trend="+12%" 
          icon={<Users className="text-blue-600" />} 
          bg="bg-blue-50"
        />
        <StatCard 
          title="Appointments" 
          value="24" 
          trend="Today"
          icon={<Activity className="text-purple-600" />} 
          bg="bg-purple-50"
        />
        <StatCard 
          title="Pending Reports" 
          value="8" 
          trend="Action Needed" 
          icon={<FileCheck className="text-orange-600" />} 
          bg="bg-orange-50"
        />
        <StatCard 
          title="Revenue" 
          value="$12.4k" 
          trend="+4.5%" 
          icon={<DollarSign className="text-green-600" />} 
          bg="bg-green-50"
        />
      </div>

      {/* MAIN CONTENT GRID */}
      <div className="grid lg:grid-cols-3 gap-8">

        {/* LEFT COLUMN (Patient List) */}
        <div className="lg:col-span-2 space-y-6">

          {/* Patient Roster Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-slate-800 text-lg">Recent Patients</h3>
              <button className="text-blue-600 text-sm font-medium hover:underline">View All</button>
            </div>

            <div className="p-6">
              {/* Search Input */}
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  placeholder="Search by name..."
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              {/* List */}
              <div className="space-y-3">
                {loading ? (
                  <div className="text-center py-8 text-slate-400 text-sm">Loading records...</div>
                ) : filteredPatients.length === 0 ? (
                  <div className="text-center py-8 text-slate-400 text-sm">No patients found.</div>
                ) : (
                  filteredPatients.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => router.push(`/doctor-dashboard/patient/${p.email}`)}
                      className="group flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/50 cursor-pointer transition-all duration-200"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-sm group-hover:bg-white group-hover:text-blue-600 transition-colors">
                          {p.full_name.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-800 group-hover:text-blue-700 transition-colors">
                            {p.full_name}
                          </h4>
                          <p className="text-xs text-slate-500">{p.email}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <span className="hidden sm:inline-block text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded-md">
                          {p.symptoms || "General Checkup"}
                        </span>
                        <ArrowRight size={16} className="text-slate-300 group-hover:text-blue-600 transition-colors" />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (Schedule & Insights) */}
        <div className="space-y-6">

          {/* Today's Schedule */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h3 className="font-bold text-slate-800 mb-4">Today Schedule</h3>
            <div className="space-y-4">
              <ScheduleItem time="09:00 AM" title="Emily Johnson" type="Consultation" status="Confirmed" />
              <ScheduleItem time="10:30 AM" title="Michael Chen" type="Follow-up" status="Pending" />
              <ScheduleItem time="11:15 AM" title="Sarah Connor" type="Surgery Prep" status="In Progress" />
            </div>
            <button className="w-full mt-6 py-2 text-sm text-slate-500 hover:text-blue-600 font-medium border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
              View Full Calendar
            </button>
          </div>

          {/* Performance Card */}
          <div className="bg-linear-to-br from-blue-600 to-blue-800 rounded-2xl shadow-lg p-6 text-white">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-blue-100 text-sm font-medium">Performance Score</p>
                <h3 className="text-3xl font-bold mt-1">98%</h3>
              </div>
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <Activity size={20} className="text-white" />
              </div>
            </div>
            <div className="w-full bg-blue-900/30 rounded-full h-2 mb-2">
              <div className="bg-white h-2 rounded-full" style={{ width: '98%' }}></div>
            </div>
            <p className="text-xs text-blue-200">Excellent patient satisfaction this week.</p>
          </div>

        </div>
      </div>
    </div>
  );
}

// Sub-components for cleaner code
function StatCard({ title, value, trend, icon, bg }: any) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-start justify-between hover:shadow-md transition-shadow">
      <div>
        <p className="text-slate-500 text-sm font-medium">{title}</p>
        <h3 className="text-2xl font-bold text-slate-800 mt-2">{value}</h3>
        <p className="text-xs font-medium text-green-600 mt-2 bg-green-50 inline-block px-2 py-0.5 rounded-full">
          {trend}
        </p>
      </div>
      <div className={`w-12 h-12 ${bg} rounded-xl flex items-center justify-center`}>
        {icon}
      </div>
    </div>
  );
}

function ScheduleItem({ time, title, type, status }: any) {
  const statusColor = 
    status === "Confirmed" ? "bg-green-100 text-green-700" :
    status === "Pending" ? "bg-yellow-100 text-yellow-700" :
    "bg-blue-100 text-blue-700";

  return (
    <div className="flex gap-4 items-center">
      <div className="flex flex-col items-center min-w-12.5">
        <span className="text-xs font-bold text-slate-700">{time.split(' ')[0]}</span>
        <span className="text-[10px] text-slate-400">{time.split(' ')[1]}</span>
      </div>
      <div className="flex-1 p-3 bg-slate-50 rounded-xl border border-slate-100">
        <div className="flex justify-between items-center">
          <h4 className="text-sm font-semibold text-slate-800">{title}</h4>
          <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${statusColor}`}>
            {status}
          </span>
        </div>
        <p className="text-xs text-slate-500 mt-1">{type}</p>
      </div>
    </div>
  );
}