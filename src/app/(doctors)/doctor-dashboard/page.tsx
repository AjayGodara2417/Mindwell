"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DoctorDashboard() {
  const router = useRouter();
  const [patients, setPatients] = useState<any[]>([]);

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
    };

    fetchPatients();
  }, [router]);

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg hidden md:flex flex-col">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold text-blue-600">MindWell</h2>
          <p className="text-sm text-gray-500">Doctor Panel</p>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-6">

        <h1 className="text-2xl font-bold mb-6">
          Doctor Dashboard
        </h1>

        {/* Patients Table */}

        <div className="bg-white rounded-xl shadow p-6">

          <h2 className="text-lg font-semibold mb-4">
            Linked Patients
          </h2>

          <table className="w-full text-left">

            <thead>
              <tr className="border-b text-gray-500 text-sm">
                <th className="py-2">Name</th>
                <th>Email</th>
                <th>Symptoms</th>
              </tr>
            </thead>

            <tbody>

              {patients.length === 0 && (
                <tr>
                  <td colSpan={3} className="py-4 text-gray-500">
                    No patients linked yet
                  </td>
                </tr>
              )}

              {patients.map((p) => (
                <tr
                  key={p.id}
                  className="border-b hover:bg-gray-50 cursor-pointer"
                  onClick={() =>
                    router.push(`/doctor-dashboard/patient/${p.email}`)
                  }
                >
                  <td className="py-3">{p.full_name}</td>
                  <td>{p.email}</td>
                  <td>{p.symptoms}</td>
                </tr>
              ))}

            </tbody>

          </table>

        </div>

      </main>

    </div>
  );
}