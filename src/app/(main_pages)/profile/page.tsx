"use client";

import { useEffect, useState } from "react";
import {
  MapPin,
  Calendar,
  TrendingUp,
  CheckCircle2,
  Award,
  User2Icon,
} from "lucide-react";

export default function ProfilePage() {

  type User = {
    full_name?: string;
    email?: string;
    // Add other fields as needed
  };

  type Assessment = {
    score: number;
    severity: string;
    percentage: number;
    created_at: string;
    // Add other fields as needed
  };

  const [user, setUser] = useState<User | null>(null);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [doctorId, setDoctorId] = useState("");

  const [points, setPoints] = useState(0);
  const [tasksCompleted, setTasksCompleted] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        /* -------- Profile -------- */
        const profileRes = await fetch("/api/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const profileData = await profileRes.json();
        setUser(profileData);

        /* -------- Assessments -------- */
        const res = await fetch(
          `/api/assessment?email=${profileData.email}`
        );

        const assessmentData = await res.json();

        if (assessmentData.success) {
          setAssessments(assessmentData.history);
        }

        /* -------- NEW: Fetch Points -------- */
        const patientRes = await fetch(
          `/api/patient?email=${profileData.email}`
        );

        const patientData = await patientRes.json();

        setPoints(patientData.points || 0);
        setTasksCompleted(patientData.tasks_completed || 0);

      } catch (error) {
        console.error("Profile load error:", error);
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  /* -------- Loading State -------- */

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh] text-gray-500">
        Loading profile...
      </div>
    );
  }

  /* -------- Dashboard Stats -------- */

  const stats = [
    {
      label: "Points",
      value: points,
      icon: Award,
    },
    {
      label: "Tasks Completed",
      value: tasksCompleted,
      icon: CheckCircle2,
    },
    {
      label: "Assessments",
      value: assessments.length,
      icon: TrendingUp,
    },
  ];

  const maxScore = Math.max(...assessments.map((a) => a.score), 75); // 75 = max possible score


  return (
  <div className="max-w-5xl mx-auto py-8 space-y-8">

    {/* Header */}
    <div className="bg-white p-6 rounded-2xl shadow-sm flex items-center gap-5">

      <div className="w-14 h-14 rounded-full bg-[#eef3f1] flex items-center justify-center">
        <User2Icon className="text-[#2f5d50]" />
      </div>

      <div>
        <h1 className="text-lg font-semibold text-gray-900">
          {user?.full_name || "User"}
        </h1>

        <p className="text-sm text-gray-500">
          {user?.email}
        </p>

        <div className="flex gap-4 text-xs text-gray-400 mt-1">
          <span className="flex items-center gap-1">
            <MapPin size={12} /> India
          </span>
          <span className="flex items-center gap-1">
            <Calendar size={12} /> Member
          </span>
        </div>
      </div>

    </div>

    {/* Link Doctor */}
    <div className="bg-white p-6 rounded-2xl shadow-sm">
      <h2 className="font-medium mb-4">Link Doctor</h2>

      <div className="flex gap-3">
        <input
          type="text"
          placeholder="Enter Doctor ID"
          value={doctorId}
          onChange={(e) => setDoctorId(e.target.value)}
          className="flex-1 bg-gray-100 px-4 py-2 rounded-xl outline-none focus:ring-2 focus:ring-[#2f5d50]"
        />

        <button
          onClick={async () => {
            const email = user?.email;

            const res = await fetch("/api/link-doctor", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                doctor_id: doctorId,
                patient_email: email,
              }),
            });

            const data = await res.json();

            if (data.success) {
              alert("Doctor linked successfully");
            } else {
              alert(data.message);
            }
          }}
          className="bg-[#2f5d50] text-white px-5 rounded-xl hover:opacity-90"
        >
          Link
        </button>
      </div>
    </div>

    {/* Stats */}
    <div className="grid md:grid-cols-3 gap-6">
      {stats.map((stat, i) => (
        <div
          key={i}
          className="bg-white p-5 rounded-2xl shadow-sm flex items-center gap-4"
        >
          <div className="p-3 rounded-xl bg-[#eef3f1]">
            <stat.icon className="text-[#2f5d50]" />
          </div>

          <div>
            <p className="text-lg font-semibold text-gray-900">
              {stat.value}
            </p>
            <p className="text-sm text-gray-500">
              {stat.label}
            </p>
          </div>
        </div>
      ))}
    </div>

    {/* Chart */}
    <div className="bg-white p-6 rounded-xl shadow">

        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="text-blue-600" />
          <h2 className="font-semibold">Mental Health Trend</h2>
        </div>

        {assessments.length === 0 ? (
          <p className="text-gray-500 text-sm">
            No assessment data available.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <div className="flex items-end h-72 gap-8 min-w-175">

              {assessments.map((item, i) => {

                const height = (item.score / maxScore) * 100;

                const barColor =
                  item.severity === "Very Severe"
                    ? "bg-red-500"
                    : item.severity === "Severe"
                      ? "bg-orange-500"
                      : item.severity === "Moderate"
                        ? "bg-yellow-500"
                        : item.severity === "Mild"
                          ? "bg-blue-500"
                          : "bg-green-500";

                return (
                  <div
                    key={i}
                    className="flex flex-col items-center w-16"
                  >

                    {/* Score */}
                    <p className="text-sm font-semibold text-gray-800 mb-2">
                      {item.score}
                    </p>

                    {/* Bar Container */}
                    <div className="w-full h-full bg-gray-100 rounded-lg flex items-end">

                      <div
                        className={`${barColor} w-full rounded-lg transition-all duration-500`}
                        style={{
                          height: `${height}%`,
                          minHeight: "100px",
                        }}
                        title={`Score: ${item.score} | ${item.severity}`}
                      />

                    </div>

                    {/* Date */}
                    <span className="text-xs text-gray-500 mt-2 text-center">
                      {new Date(item.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>

                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

    {/* Legend */}
    <div className="bg-white p-4 rounded-2xl shadow-sm flex flex-wrap gap-5 text-xs text-gray-600">

      <span className="flex items-center gap-2">
        <div className="w-3 h-3 bg-green-400 rounded"></div> Minimal
      </span>

      <span className="flex items-center gap-2">
        <div className="w-3 h-3 bg-blue-400 rounded"></div> Mild
      </span>

      <span className="flex items-center gap-2">
        <div className="w-3 h-3 bg-yellow-400 rounded"></div> Moderate
      </span>

      <span className="flex items-center gap-2">
        <div className="w-3 h-3 bg-orange-400 rounded"></div> Severe
      </span>

      <span className="flex items-center gap-2">
        <div className="w-3 h-3 bg-red-400 rounded"></div> Very Severe
      </span>

    </div>

  </div>
);
}