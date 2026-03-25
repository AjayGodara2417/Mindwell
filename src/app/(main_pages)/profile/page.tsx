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
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export default function ProfilePage() {

  type User = {
    full_name?: string;
    email?: string;
  };

  type Assessment = {
    score: number;
    severity: string;
    percentage: number;
    created_at: string;
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

  const chartData = assessments.map((item) => {
    const dateObj = new Date(item.created_at);

    return {
      score: Number(item.score),
      timestamp: dateObj.getTime(), // ✅ REAL VALUE (fixes hover)
      date: dateObj.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      fullDate: dateObj.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      severity: item.severity,
    };
  });



  return (
    <div className="bg-[#f6f8f7] min-h-screen p-8">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* HEADER GRID */}
        <div className="grid md:grid-cols-2 gap-6">

          {/* PROFILE CARD */}
          <div className="bg-white p-6 rounded-2xl shadow-sm flex items-center gap-5">

            <div className="w-16 h-16 rounded-xl bg-[#eef3f1] flex items-center justify-center">
              <User2Icon className="text-[#2f5d50]" size={28} />
            </div>

            <div>
              <h1 className="text-lg font-semibold text-gray-900">
                {user?.full_name || "User"}
              </h1>

              <p className="text-sm text-gray-500">
                {user?.email}
              </p>

              <div className="flex gap-3 mt-2 flex-wrap">
                <span className="flex items-center gap-1 text-xs bg-gray-100 px-2 py-1 rounded-full">
                  <MapPin size={12} /> India
                </span>
                <span className="flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                  <Calendar size={12} /> Member since 2023
                </span>
              </div>
            </div>
          </div>

          {/* LINK DOCTOR */}
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <h2 className="font-medium mb-2">Link Your Doctor</h2>
            <p className="text-sm text-gray-400 mb-4">
              Connect with your professional care team for real-time progress sharing.
            </p>

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

                  if (data.success) alert("Doctor linked successfully");
                  else alert(data.message);
                }}
                className="bg-[#2f5d50] text-white px-5 rounded-xl hover:opacity-90"
              >
                Link
              </button>
            </div>
          </div>
        </div>

        {/* STATS */}
        <div className="grid md:grid-cols-3 gap-6">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="bg-white p-5 rounded-2xl shadow-sm flex items-center justify-between"
            >
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {stat.value}
                </p>
                <p className="text-xs text-gray-400 mt-1 uppercase tracking-wide">
                  {stat.label}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#eef3f1]">
                <stat.icon className="text-[#2f5d50]" />
              </div>
            </div>
          ))}
        </div>

        {/* MENTAL HEALTH TREND */}
        <div className="bg-white p-6 rounded-2xl shadow-sm">

          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="text-[#2f5d50]" />
              <h2 className="font-semibold text-gray-800">
                Assessment score 
              </h2>
            </div>

            <span className="text-xs text-gray-400">
              Last {assessments.length} records
            </span>
          </div>

          {assessments.length === 0 ? (
            <p className="text-gray-400 text-sm">
              No assessment data available.
            </p>
          ) : (
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>

                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />

                  <XAxis
                    dataKey="timestamp"
                    type="number"
                    domain={["dataMin", "dataMax"]}
                    tickFormatter={(tick) =>
                      new Date(tick).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })
                    }
                  />

                  <YAxis domain={[0, 75]} />

                  <Tooltip
                    labelFormatter={(label) =>
                      new Date(label).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    }
                    formatter={(value, name, props) => {
                      const data = props.payload;

                      return [
                        `Score: ${value} / 75`,
                        `Severity: ${data.severity}`,
                      ];
                    }}
                  />

                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#2f5d50"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                    activeDot={{ r: 7 }}
                  />

                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}