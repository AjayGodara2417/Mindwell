"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  ArrowRight,
  Users,
  Plus,
  Calendar,
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

  const [showModal, setShowModal] = useState(false);
  const [patientEmail, setPatientEmail] = useState("");
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const doctorId =
      typeof window !== "undefined"
        ? localStorage.getItem("doctorId")
        : null;

    const fetchPatients = async () => {
      try {
        const res = await fetch(
          `/api/doctor-patients?doctor_id=${doctorId}`
        );
        const data = await res.json();

        const enhanced = data.patients.map((p: any) => ({
          ...p,
          risk_level:
            p.risk_level ||
            (Math.random() > 0.7 ? "High" : "Low"),
          last_checkin: "2 hours ago",
        }));

        if (data.success) setPatients(enhanced);
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

  const handleAddPatient = async () => {
  if (!patientEmail.trim()) return;

  setLoading(true);
  setError(""); // reset old error

  try {
    const res = await fetch("/api/add-patient", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: patientEmail,
        doctor_id: localStorage.getItem("doctorId"),
      }),
    });

    const data = await res.json();

    alert("Patient added successfully");

    if (!data.success) {
      setError(data.message || "Patient not found");
      return; // ❗ exits, BUT finally will still run
    }

    // ✅ success case
    setPatientEmail("");
    setShowModal(false);
    // fetchPatients();

  } catch (err) {
    console.error(err);
    setError("Something went wrong");
  } finally {
    // ✅ THIS LINE FIXES YOUR ISSUE
    setLoading(false);
  }
};

  return (
    <div className="bg-slate-50 min-h-screen p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* HEADER */}
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              Doctor Dashboard 👨‍⚕️
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Monitor patient health and track risk levels.
            </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="bg-teal-600 text-white px-5 py-2 rounded-xl text-sm font-medium hover:bg-teal-700 shadow-lg shadow-teal-500/20 transition-all flex items-center gap-2"
          >
            <Plus size={16} /> Add Patient
          </button>

          {showModal && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
              <div className="bg-white w-full max-w-md p-6 rounded-2xl shadow-xl animate-in fade-in zoom-in-95">

                <h2 className="text-xl font-bold text-slate-800 mb-4">
                  Add Patient
                </h2>

                <p className="text-sm text-slate-500 mb-4">
                  Enter patient email to link with your account
                </p>

                <input
                  type="email"
                  placeholder="patient@email.com"
                  value={patientEmail}
                  onChange={(e) => setPatientEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-teal-500 outline-none mb-3"
                />

                {error && (
                  <p className="text-red-500 text-xs mb-3">{error}</p>
                )}

                <div className="flex justify-end gap-3 mt-4">
                  <button
                    onClick={() => {
                      setShowModal(false);
                      setPatientEmail("");
                      setError("");
                    }}
                    className="px-4 py-2 text-sm rounded-lg border border-slate-200 hover:bg-slate-50"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={handleAddPatient}
                    disabled={adding}
                    className="px-5 py-2 bg-teal-600 text-white rounded-lg text-sm hover:bg-teal-700 disabled:opacity-50"
                  >
                    {adding ? "Adding..." : "Add"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="Total Patients"
            value={patients.length}
            icon={<Users size={20} />}
          />
          <StatCard
            title="Today's Date"
            value={new Date().toLocaleDateString()}
            icon={<Calendar size={20} />}
          />
        </div>

        {/* PATIENT LIST */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">

          {/* SEARCH */}
          <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
            <div className="relative w-full md:w-96">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
              <input
                placeholder="Search patients..."
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-teal-500 outline-none"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* TABLE HEADER */}
          <div className="hidden md:grid grid-cols-3 text-xs text-slate-400 mb-3 px-3">
            <span>Patient</span>
            <span>Condition</span>
            {/* <span></span> */}
            <span className="text-right">Check Details</span>
          </div>

          {/* LIST */}
          <div className="space-y-3">
            {loading ? (
              <p className="text-center py-10 text-slate-400">
                Loading patients...
              </p>
            ) : filteredPatients.length === 0 ? (
              <p className="text-center py-10 text-slate-400">
                No patients found
              </p>
            ) : (
              filteredPatients.map((p) => (
                <div
                  key={p.id}
                  onClick={() =>
                    router.push(
                      `/doctor-dashboard/patient/${p.email}`
                    )
                  }
                  className="grid grid-cols-1 md:grid-cols-3 items-center gap-4 p-4 rounded-xl hover:bg-slate-50 transition cursor-pointer border border-transparent hover:border-slate-200"
                >

                  {/* PROFILE */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-teal-600 text-white flex items-center justify-center font-bold">
                      {p.full_name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-slate-800">
                        {p.full_name}
                      </p>
                      <p className="text-xs text-slate-400">
                        {p.email}
                      </p>
                    </div>
                  </div>

                  {/* CONDITION */}
                  <div className="text-sm text-slate-600">
                    {p.symptoms || "General Checkup"}
                  </div>

                  {/* STATUS */}
                  {/* <div>
                  </div> */}

                  {/* ACTION */}
                  <div className="flex justify-end items-center gap-3">
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
    </div>
  );
}

/* ================= STAT CARD ================= */

function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: number | string;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 flex items-center justify-between">
      <div>
        <p className="text-xs text-slate-400">{title}</p>
        <h3 className="text-3xl font-bold text-slate-800">
          {value}
        </h3>
      </div>
      <div className="p-3 bg-teal-50 rounded-lg text-teal-600">
        {icon}
      </div>
    </div>
  );
}