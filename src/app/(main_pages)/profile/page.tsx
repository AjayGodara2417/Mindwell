"use client";

import { useEffect, useState } from "react";
import {
  MapPin,
  Calendar,
  TrendingUp,
  CheckCircle2,
  Award,
  User2,
  Link as LinkIcon,
  Activity
} from "lucide-react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export default function ProfilePage() {
  type User = { full_name?: string; email?: string; };
  type Assessment = { score: number; severity: string; percentage: number; created_at: string; };

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
        const profileRes = await fetch("/api/profile", { headers: { Authorization: `Bearer ${token}` } });
        const profileData = await profileRes.json();
        setUser(profileData);

        const res = await fetch(`/api/assessment?email=${profileData.email}`);
        const assessmentData = await res.json();
        if (assessmentData.success) setAssessments(assessmentData.history);

        const patientRes = await fetch(`/api/patient?email=${profileData.email}`);
        const patientData = await patientRes.json();
        setPoints(patientData.points || 0);
        setTasksCompleted(patientData.tasks_completed || 0);
      } catch (error) {
        console.error("Profile load error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50 text-slate-500">
        <div className="w-10 h-10 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  const stats = [
    { label: "Wellness Points", value: points, icon: Award, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Tasks Completed", value: tasksCompleted, icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50" },       
    { label: "Assessments", value: assessments.length, icon: Activity, color: "text-blue-600", bg: "bg-blue-50" },
  ];

  const chartData = assessments.map((item) => {
    const dateObj = new Date(item.created_at);
    return {
      score: Number(item.score),
      timestamp: dateObj.getTime(),
      date: dateObj.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      severity: item.severity,
    };
  });

  return (
    <div className="bg-slate-50 min-h-screen p-6 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* HEADER GRID */}
        <div className="grid md:grid-cols-3 gap-6">

          {/* Profile Card */}
          <div className="md:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-6">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white shadow-lg shadow-teal-500/20">
              <User2 size={32} />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-slate-800">{user?.full_name || "User"}</h1>
              <p className="text-slate-500 text-sm mb-4">{user?.email}</p>
              <div className="flex gap-3 flex-wrap">
                <span className="flex items-center gap-1.5 text-xs font-medium bg-slate-100 text-slate-600 px-3 py-1.5 rounded-full">
                  <MapPin size={14} /> India
                </span>
                <span className="flex items-center gap-1.5 text-xs font-medium bg-teal-50 text-teal-700 px-3 py-1.5 rounded-full border border-teal-100">
                  <Calendar size={14} /> Member since 2023
                </span>
              </div>
            </div>
          </div>

          {/* Link Doctor Card */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-3 text-slate-800">
              <LinkIcon size={20} className="text-teal-600" />
              <h2 className="font-bold">Connect Doctor</h2>
            </div>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              Share your progress securely with your healthcare provider.
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Doctor ID"
                value={doctorId}
                onChange={(e) => setDoctorId(e.target.value)}
                className="flex-1 bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 outline-none"
              />
              <button
                onClick={async () => {
                  const email = user?.email;
                  const res = await fetch("/api/link-doctor", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ doctor_id: doctorId, patient_email: email }),
                  });
                  const data = await res.json();
                  alert(data.success ? "Doctor linked!" : data.message);
                }}
                className="bg-teal-600 hover:bg-teal-700 text-white px-4 rounded-lg text-sm font-medium transition-colors"
              >
                Link
              </button>
            </div>
          </div>
        </div>

        {/* STATS GRID */}
        <div className="grid md:grid-cols-3 gap-6">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between hover:shadow-md transition-shadow">
              <div>
                <p className="text-3xl font-bold text-slate-800">{stat.value}</p>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mt-1">{stat.label}</p>
              </div>
              <div className={`p-3 rounded-xl ${stat.bg}`}>
                <stat.icon className={stat.color} size={24} />
              </div>
            </div>
          ))}
        </div>

        {/* CHART SECTION */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                <TrendingUp size={20} />
              </div>
              <div>
                <h2 className="font-bold text-slate-800">Mental Health Trend</h2>
                <p className="text-xs text-slate-500">Based on your assessment history</p>
              </div>
            </div>
            <span className="text-xs font-medium text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
              Last {assessments.length} Records
            </span>
          </div>

          {assessments.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
              <Activity size={40} className="mb-2 opacity-50" />
              <p className="text-sm">No assessment data available yet.</p>
            </div>
          ) : (
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="timestamp"
                    type="number"
                    domain={["dataMin", "dataMax"]}
                    tickFormatter={(tick) => new Date(tick).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    tick={{fontSize: 12, fill: '#94a3b8'}}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis domain={[0, 75]} tick={{fontSize: 12, fill: '#94a3b8'}} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    labelFormatter={(label) => new Date(label).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })}
                    formatter={(value, name, props) => [`Score: ${value} / 75`, `Severity: ${props.payload.severity}`]}
                  />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#0d9488"
                    strokeWidth={3}
                    dot={{ r: 4, fill: '#0d9488', strokeWidth: 2, stroke: '#fff' }}
                    activeDot={{ r: 6, fill: '#0d9488' }}
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