"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Users,
  Search,
  ArrowRight,
  Bell,
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
    const token = localStorage.getItem("token");
    const doctorId = localStorage.getItem("doctorId");

    if (!token) {
      router.push("/login");
      return;
    }

    const fetchPatients = async () => {
      const res = await fetch(
        `/api/doctor-patients?doctor_id=${doctorId}`
      );
      const data = await res.json();

      if (data.success) {
        setPatients(data.patients);
      }

      setLoading(false);
    };

    fetchPatients();
  }, [router]);

  const filteredPatients = patients.filter((p) =>
    p.full_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6">

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-semibold text-gray-800">
            Welcome back
          </h1>
          <p className="text-gray-500 text-sm">
            Your Digital Dashboard • {new Date().toDateString()}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <Bell className="text-gray-500 cursor-pointer" />
          <div className="w-9 h-9 rounded-full bg-gray-300" />
        </div>
      </div>

      {/* Top Grid */}
      <div className="grid lg:grid-cols-3 gap-6">

        {/* LEFT MAIN */}
        <div className="lg:col-span-2 space-y-6">

          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-6">

            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <p className="text-sm text-gray-500">
                Total Patients
              </p>
              <h2 className="text-2xl font-bold mt-2">
                {patients.length}
              </h2>
            </div>

            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <p className="text-sm text-gray-500">
                Platform Status
              </p>
              <h2 className="text-green-600 font-semibold mt-2">
                Active
              </h2>
            </div>

            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <p className="text-sm text-gray-500">
                Last Sync
              </p>
              <h2 className="font-semibold mt-2">
                {new Date().toLocaleDateString()}
              </h2>
            </div>

          </div>

          {/* Chart Placeholder */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-700">
                Patient Activity Overview
              </h3>
              <span className="text-sm bg-green-100 text-green-600 px-3 py-1 rounded-full">
                Weekly +12%
              </span>
            </div>

            {/* Fake bars */}
            <div className="flex items-end gap-4 h-40">
              {[40, 25, 60, 50, 45, 30, 42].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 bg-gray-200 rounded-lg relative"
                  style={{ height: `${h}%` }}
                >
                  <div className="absolute bottom-0 left-0 w-full h-2 bg-teal-600 rounded-b-lg" />
                </div>
              ))}
            </div>
          </div>

          {/* Patient Roster */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">

            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-700">
                Patient Roster
              </h3>
            </div>

            {/* Search */}
            <div className="flex items-center gap-3 bg-gray-100 px-3 py-2 rounded-lg mb-4">
              <Search size={16} className="text-gray-400" />
              <input
                placeholder="Search patients..."
                className="bg-transparent outline-none w-full text-sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* List */}
            <div className="space-y-3">

              {loading && (
                <p className="text-gray-500 text-sm">
                  Loading patients...
                </p>
              )}

              {!loading && filteredPatients.length === 0 && (
                <p className="text-gray-500 text-sm">
                  No patients linked yet
                </p>
              )}

              {filteredPatients.map((p) => (
                <div
                  key={p.id}
                  onClick={() =>
                    router.push(
                      `/doctor-dashboard/patient/${p.email}`
                    )
                  }
                  className="flex justify-between items-center p-4 border rounded-xl hover:bg-gray-50 cursor-pointer transition"
                >
                  <div>
                    <h4 className="font-medium text-gray-800">
                      {p.full_name}
                    </h4>
                    <p className="text-xs text-gray-500">
                      {p.email}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {p.symptoms}
                    </p>
                  </div>

                  <ArrowRight
                    size={18}
                    className="text-gray-400"
                  />
                </div>
              ))}

            </div>

          </div>

        </div>

        {/* RIGHT PANEL */}
        <div className="space-y-6">

          {/* Sessions */}
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h3 className="font-semibold mb-4">
              Quick Insights
            </h3>

            <div className="space-y-3 text-sm text-gray-600">
              <p>• Monitor patient trends</p>
              <p>• Review recent activity</p>
              <p>• Track engagement</p>
            </div>
          </div>

          {/* Highlight Card */}
          <div className="bg-pink-100 rounded-2xl p-5">
            <h3 className="font-semibold text-gray-700">
              Performance
            </h3>

            <div className="flex justify-between mt-4">
              <div>
                <p className="text-xl font-bold">128</p>
                <p className="text-xs text-gray-500">
                  Sessions
                </p>
              </div>

              <div>
                <p className="text-xl font-bold">94%</p>
                <p className="text-xs text-gray-500">
                  Success Rate
                </p>
              </div>
            </div>
          </div>

          {/* Response Time */}
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h3 className="text-sm text-gray-500 mb-3">
              Response Time
            </h3>

            <div className="flex items-end gap-2 h-20">
              {[10, 20, 35, 30, 45].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 bg-teal-200 rounded"
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>

            <p className="text-sm mt-2 text-gray-600">
              Avg: 18 mins
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}