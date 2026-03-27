"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

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
        const res = await fetch(
          `/api/doctor-patients?doctor_id=${doctorId}`
        );
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
    <div className="p-6 space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-800">
          All Patients
        </h1>
        <p className="text-gray-500 text-sm">
          View and manage all assigned patients
        </p>
      </div>

      {/* Search */}
      <div className="flex items-center gap-3 bg-gray-100 px-4 py-3 rounded-xl">
        <Search size={16} className="text-gray-400" />
        <input
          placeholder="Search patients..."
          className="bg-transparent outline-none w-full"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

        {loading && <p>Loading...</p>}

        {!loading && filteredPatients.length === 0 && (
          <p className="text-gray-500">No patients found</p>
        )}

        {filteredPatients.map((p) => (
          <div
            key={p.id}
            onClick={() =>
              router.push(`/doctor-dashboard/patient/${p.email}`)
            }
            className="bg-white p-5 rounded-2xl shadow-sm hover:shadow-md cursor-pointer transition"
          >
            <div className="flex flex-col gap-2">
              <h3 className="font-semibold text-gray-800">
                {p.full_name}
              </h3>

              <p className="text-sm text-gray-500">
                {p.email}
              </p>

              <p className="text-xs text-gray-400 line-clamp-2">
                {p.symptoms}
              </p>
            </div>

            <div className="mt-4 text-xs text-teal-600 font-medium">
              View Profile →
            </div>
          </div>
        ))}

      </div>
    </div>
  );
}