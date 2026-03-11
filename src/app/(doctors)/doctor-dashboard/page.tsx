"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DoctorDashboard() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
    }
  }, [router]);

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg hidden md:flex flex-col">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold text-blue-600">MindWell</h2>
          <p className="text-sm text-gray-500">Doctor Panel</p>
        </div>

        <nav className="flex flex-col p-4 gap-2">
          <button className="text-left px-4 py-2 rounded-lg hover:bg-blue-50">
            Dashboard
          </button>

          <button className="text-left px-4 py-2 rounded-lg hover:bg-blue-50">
            Appointments
          </button>

          <button className="text-left px-4 py-2 rounded-lg hover:bg-blue-50">
            Patients
          </button>

          <button className="text-left px-4 py-2 rounded-lg hover:bg-blue-50">
            Messages
          </button>

          <button className="text-left px-4 py-2 rounded-lg hover:bg-blue-50">
            Profile
          </button>
        </nav>

        <div className="mt-auto p-4 border-t">
          <button
            onClick={() => {
              localStorage.removeItem("token");
              router.push("/login");
            }}
            className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-6">

        {/* Top Bar */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">
            Doctor Dashboard
          </h1>

          <div className="bg-white px-4 py-2 rounded-lg shadow">
            Welcome Doctor 👋
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">

          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-gray-500 text-sm">Total Patients</h3>
            <p className="text-3xl font-bold text-blue-600 mt-2">24</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-gray-500 text-sm">Appointments Today</h3>
            <p className="text-3xl font-bold text-green-600 mt-2">6</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-gray-500 text-sm">Pending Messages</h3>
            <p className="text-3xl font-bold text-purple-600 mt-2">3</p>
          </div>

        </div>

        {/* Recent Patients */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Patients</h2>

          <table className="w-full text-left">
            <thead>
              <tr className="text-gray-500 text-sm border-b">
                <th className="py-2">Name</th>
                <th>Symptoms</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody className="text-gray-700">
              <tr className="border-b">
                <td className="py-3">John Doe</td>
                <td>Anxiety</td>
                <td className="text-green-600">Active</td>
              </tr>

              <tr className="border-b">
                <td className="py-3">Emma Smith</td>
                <td>Stress</td>
                <td className="text-yellow-600">Pending</td>
              </tr>

              <tr>
                <td className="py-3">David Miller</td>
                <td>Depression</td>
                <td className="text-green-600">Active</td>
              </tr>
            </tbody>
          </table>
        </div>

      </main>
    </div>
  );
}