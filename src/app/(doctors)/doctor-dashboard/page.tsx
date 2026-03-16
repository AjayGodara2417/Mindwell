"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Users, Search, ArrowRight } from "lucide-react";

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
      const res = await fetch(`/api/doctor-patients?doctor_id=${doctorId}`);
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
    <div className="flex min-h-screen bg-gray-50">

      {/* Main */}

      <main className="flex-1 p-8">

        {/* Header */}

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">
            Doctor Dashboard
          </h1>
        </div>

        {/* Stats */}

        <div className="grid md:grid-cols-3 gap-6 mb-8">

          <div className="bg-white p-6 rounded-xl shadow-sm flex items-center gap-4">
            <Users className="text-blue-600" size={32} />
            <div>
              <p className="text-gray-500 text-sm">Total Patients</p>
              <h3 className="text-2xl font-bold">{patients.length}</h3>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <p className="text-gray-500 text-sm">Platform Status</p>
            <h3 className="text-lg font-semibold text-green-600">
              Active
            </h3>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <p className="text-gray-500 text-sm">Last Sync</p>
            <h3 className="text-lg font-semibold">
              {new Date().toLocaleDateString()}
            </h3>
          </div>

        </div>

        {/* Search */}

        <div className="bg-white p-4 rounded-xl shadow-sm mb-6 flex items-center gap-3">
          <Search size={18} className="text-gray-400" />
          <input
            placeholder="Search patients..."
            className="w-full outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Patients */}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

          {loading && (
            <p className="text-gray-500">Loading patients...</p>
          )}

          {!loading && filteredPatients.length === 0 && (
            <p className="text-gray-500">
              No patients linked yet
            </p>
          )}

          {filteredPatients.map((p) => (
            <div
              key={p.id}
              onClick={() =>
                router.push(`/doctor-dashboard/patient/${p.email}`)
              }
              className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition cursor-pointer"
            >
              <h3 className="font-semibold text-lg mb-1">
                {p.full_name}
              </h3>

              <p className="text-sm text-gray-500 mb-3">
                {p.email}
              </p>

              <p className="text-sm text-gray-600 mb-4">
                {p.symptoms}
              </p>

              <div className="flex items-center text-blue-600 text-sm font-medium">
                View Details
                <ArrowRight size={16} className="ml-1" />
              </div>

            </div>
          ))}

        </div>

      </main>

    </div>
  );
}