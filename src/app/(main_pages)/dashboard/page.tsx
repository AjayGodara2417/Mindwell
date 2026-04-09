"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import AIChatModal from "../../../../components/AIChatModal";
import {
  TrendingUp,
  CheckCircle,
  Wind,
  Activity,
  Moon,
  ListTodo,
  X,
  Play
} from "lucide-react";

import {
  Assessment,
  SleepEntry,
  Task,
  Profile,
  AssessmentResponse,
  SleepResponse,
  IntervalRef,
  TaskType,
  WeightEntry,
} from "@/types/dashboard";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  LineChart,
  Line,
  Cell,
} from "recharts";
import { useRouter } from "next/navigation";

export default function Stats() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen text-slate-500">Loading dashboard...</div>}>
      <StatsData />
    </Suspense>
  );
}

function StatsData() {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [sleepData, setSleepData] = useState<SleepEntry[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [weeklyTasks, setWeeklyTasks] = useState<Task[]>([]);
  const [recentTasks, setRecentTasks] = useState<Task[]>([]);
  const [sleepHours, setSleepHours] = useState<string>("");
  const [date, setDate] = useState<Date>(new Date());
  const [loading, setLoading] = useState<boolean>(true);

  const [isAIOpen, setIsAIOpen] = useState(false);

  const [isSessionActive, setIsSessionActive] = useState<boolean>(false);
  const [secondsLeft, setSecondsLeft] = useState<number>(0);
  const intervalRef = useRef<IntervalRef>(null);

  const [isShakeActive, setIsShakeActive] = useState<boolean>(false);
  const [shakeSeconds, setShakeSeconds] = useState<number>(0);
  const shakeIntervalRef = useRef<IntervalRef>(null);

  const [weightData, setWeightData] = useState<WeightEntry[]>([]);
  const [weight, setWeight] = useState<string>("");

  const router = useRouter();

  const email = typeof window !== "undefined" ? localStorage.getItem("userEmail") : null;

  // ================= TIMER LOGIC =================
  const startSession = () => {
    setSecondsLeft(300);
    setIsSessionActive(true);
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          if (intervalRef.current !== null) clearInterval(intervalRef.current);
          intervalRef.current = null;
          setIsSessionActive(false);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
  };

  const exitSession = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = null;
    setIsSessionActive(false);
    setSecondsLeft(0);
  };

  const startShakeSession = () => {
    setShakeSeconds(300);
    setIsShakeActive(true);
    if (shakeIntervalRef.current) clearInterval(shakeIntervalRef.current);
    shakeIntervalRef.current = setInterval(() => {
      setShakeSeconds((s) => {
        if (s <= 1) {
          if (shakeIntervalRef.current !== null) clearInterval(shakeIntervalRef.current);
          shakeIntervalRef.current = null;
          setIsShakeActive(false);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
  };

  const exitShakeSession = () => {
    if (shakeIntervalRef.current) clearInterval(shakeIntervalRef.current);
    shakeIntervalRef.current = null;
    setIsShakeActive(false);
    setShakeSeconds(0);
  };

  const weightChartData = weightData
    .map((item: WeightEntry) => {
      const d = new Date(item.created_at || item.date || item.timestamp || "");
      return { ...item, _dateObj: d };
    })
    .sort((a, b) => a._dateObj.getTime() - b._dateObj.getTime())
    .slice(-7)
    .map((item) => ({
      weight: item.weight,
      date: item._dateObj.toLocaleDateString(),
    }));


  useEffect(() => {
    return () => {
      if (intervalRef.current !== null) clearInterval(intervalRef.current);
      if (shakeIntervalRef.current !== null) clearInterval(shakeIntervalRef.current);
    };
 console.log("AI DATA:", userData); }, []);

  // FETCH DATA
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const profileRes = await fetch("/api/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!profileRes.ok) throw new Error("Profile fetch failed");
        const profile: Profile = await profileRes.json();
        if (!profile?.email) throw new Error("No email found");

        const assessRes = await fetch(`/api/assessment?email=${profile.email}`);
        const assess: AssessmentResponse = await assessRes.json();
        if (assess.success && Array.isArray(assess.history)) {
          const sorted = assess.history
            .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
            .slice(-10);
          setAssessments(sorted);
        }

        const weightRes = await fetch(`/api/weight?email=${profile.email}`);
        const weightJson = await weightRes.json();

        if (weightJson.success) setWeightData(weightJson.data);

        const sleepRes = await fetch(`/api/sleep?email=${profile.email}`);
        const sleep: SleepResponse = await sleepRes.json();
        if (sleep.success) setSleepData(sleep.data);

        if (email) {
          const res = await fetch(`/api/tasks?email=${email}`);
          const data: Task[] = await res.json();
          const sorted = data.sort((a, b) => b.id - a.id);
          setTasks(sorted);
          setRecentTasks(sorted.slice(0, 3));
          const weekly = sorted.filter((t) => t.type === TaskType.Weekly).slice(-4);
          setWeeklyTasks(weekly);
        }
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [email]);

  const getSleepDayKey = () => {
    const now = new Date();
    const adjusted = new Date(now);
    if (now.getHours() < 6) adjusted.setDate(adjusted.getDate() - 1);
    return adjusted.toISOString().split("T")[0];
  };

  const [isSleepLocked, setIsSleepLocked] = useState(() => {
    if (typeof window === "undefined") return false;
    const last = localStorage.getItem("lastSleepEntry");
    const todayKey = getSleepDayKey();
    return last === todayKey;
  });

  const getWeightDayKey = () => {
    const now = new Date();
    const adjusted = new Date(now);

    // same rule as sleep (before 6 AM = previous day)
    if (now.getHours() < 6) adjusted.setDate(adjusted.getDate() - 1);

    return adjusted.toISOString().split("T")[0];
  };

  const [isWeightLocked, setIsWeightLocked] = useState(() => {
    if (typeof window === "undefined") return false;

    const last = localStorage.getItem("lastWeightEntry");
    const todayKey = getWeightDayKey();

    return last === todayKey;
  });

  const saveWeight = async () => {
    if (!weight || isWeightLocked) return;

    try {
      const token = localStorage.getItem("token");
      const profile = await fetch("/api/profile", {
        headers: { Authorization: `Bearer ${token}` },
      }).then((r) => r.json());

      if (!profile?.email) return;

      await fetch("/api/weight", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: profile.email,
          weight: Number(weight),
        }),
      });

      // ✅ LOCK AFTER SAVE
      const key = getWeightDayKey();
      localStorage.setItem("lastWeightEntry", key);
      setIsWeightLocked(true);

      setWeight("");

      const updated = await fetch(`/api/weight?email=${profile.email}`).then((r) => r.json());
      if (updated.success) setWeightData(updated.data);

    } catch (err) {
      console.error("Weight save error:", err);
    }
  };


  // DERIVED DATA
  const latest: Assessment | undefined = assessments[assessments.length - 1];
  const getSeverityFromScore = (score: number) => {
    if (score <= 9) return { label: "Minimal", color: "#10b981" };
    if (score <= 19) return { label: "Mild", color: "#eab308" };
    if (score <= 29) return { label: "Moderate", color: "#f97316" };
    return { label: "Severe", color: "#ef4444" };
  };

  const mentalChartData = assessments.map((item) => {
    const severity = getSeverityFromScore(item.score);
    return {
      score: item.score,
      date: new Date(item.created_at).toLocaleDateString(),
      severity: severity.label,
      fill: severity.color,
    };
  });

  const endDate = new Date();
  endDate.setHours(23, 59, 59, 999);
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - 6);
  startDate.setHours(0, 0, 0, 0);

  const sleepChartData = sleepData
    .map((item: SleepEntry) => {
      const d = new Date(item.created_at ?? item.date ?? item.timestamp ?? "");
      return { ...item, _dateObj: d };
    })
    .filter((item) => item._dateObj && item._dateObj >= startDate && item._dateObj <= endDate)
    .sort((a, b) => a._dateObj.getTime() - b._dateObj.getTime())
    .slice(-7)
    .map((item) => ({
      hours: item.hours,
      date: item._dateObj.toLocaleDateString(),
    }));

  const saveSleep = async () => {
    if (!sleepHours || isSleepLocked) return;
    try {
      const token = localStorage.getItem("token");
      const profile = await fetch("/api/profile", {
        headers: { Authorization: `Bearer ${token}` },
      }).then((r) => r.json());
      if (!profile?.email) return;

      await fetch("/api/sleep", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: profile.email, hours: Number(sleepHours) }),
      });

      const key = getSleepDayKey();
      localStorage.setItem("lastSleepEntry", key);
      setIsSleepLocked(true);
      setSleepHours("");

      const updated = await fetch(`/api/sleep?email=${profile.email}`).then((r) => r.json());
      if (updated.success) setSleepData(updated.data);
    } catch (err) {
      console.error("Sleep save error:", err);
    }
  };

  const score = latest?.score || 0;
  const percentage = Math.round((score / 75) * 100);

  const getSeverity = () => {
    if (score <= 9) return { label: "Minimal", color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200" };
    if (score <= 19) return { label: "Mild", color: "text-yellow-600", bg: "bg-yellow-50", border: "border-yellow-200" };
    if (score <= 29) return { label: "Moderate", color: "text-orange-600", bg: "bg-orange-50", border: "border-orange-200" };
    return { label: "Severe", color: "text-red-600", bg: "bg-red-50", border: "border-red-200" };
  };

  const severity = getSeverity();

  const getMessage = () => {
    if (score <= 9) return "Your responses indicate minimal signs of depression. Keep maintaining a healthy lifestyle.";
    if (score <= 19) return "You may be experiencing mild symptoms. Consider small lifestyle changes and self-care.";
    if (score <= 29) return "Moderate symptoms detected. It may help to talk to someone or seek guidance.";
    return "Severe symptoms detected. Please consider reaching out to a professional for support.";
  };

  const avgSleep =
    sleepChartData.reduce((a, b) => a + b.hours, 0) /
    (sleepChartData.length || 1);

  const getSleepInsight = () => {
    if (avgSleep >= 7)
      return "Great job! You're maintaining healthy sleep habits.";
    if (avgSleep >= 5)
      return "You're getting moderate sleep. Try improving consistency.";
    return "Low sleep detected. This may impact mental health — prioritize rest.";
  };

  const getWeightTrend = () => {
    if (weightChartData.length < 2) return "stable";

    const first = weightChartData[0].weight;
    const last = weightChartData[weightChartData.length - 1].weight;

    if (last > first + 0.5) return "increasing";
    if (last < first - 0.5) return "decreasing";
    return "stable";
  };

  const getWeightInsight = () => {
    const trend = getWeightTrend();

    if (trend === "increasing")
      return "Your weight is trending upward. Monitor diet and activity.";
    if (trend === "decreasing")
      return "You're losing weight. Ensure it's healthy and sustainable.";
    return "Your weight is stable. Keep maintaining your routine.";
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-slate-50 text-slate-500">
        <div className="w-12 h-12 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin mb-4"></div>
        <p className="font-medium">Loading your wellness data...</p>
      </div>
    );
  }

  const aiUserData = {
    score,
    severity: severity.label,
    sleepAvg: avgSleep,
    weightTrend: getWeightTrend(),
    mood: latest?.mood || "unknown",
    recentScoreTrend: mentalChartData.slice(-5),
  };
  const userData = {
    score,
    severity: severity.label,
    sleepAvg: avgSleep,
    weightTrend: getWeightTrend(),
    mood: latest?.mood || "unknown",
    recentScoreTrend: mentalChartData.slice(-5),
  };

  return (
    <div className="bg-slate-50 min-h-screen p-6 md:p-8 animate-in fade-in duration-500">
      {/* Custom CSS for Calendar Theming */}
      <style jsx global>{`
        .react-calendar { border: none; font-family: inherit; }
        .react-calendar__tile { border-radius: 0.5rem; font-size: 0.875rem; }
        .react-calendar__tile--active { background: #0d9488 !important; color: white; }
        .react-calendar__tile--active:enabled:hover { background: #0f766e !important; }
        .react-calendar__tile:enabled:hover { background: #f0fdfa; }
        .react-calendar__navigation button { color: #0d9488; }
      `}</style>

      <div className="max-w-7xl mx-auto space-y-8">

        {/* HEADER */}
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Welcome back 👋</h1>
            <p className="text-slate-500 text-sm mt-1">Track your mental wellness and sleep patterns daily.</p>
          </div>
          <div className="hidden md:block text-sm text-slate-400 font-medium">
            {new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>

        {/* TOP GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* SCORE CARD */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 flex flex-col items-center text-center space-y-4">
            <div className="w-full flex justify-between items-center mb-2">
              <h3 className="font-bold text-slate-700">Mental Health Score</h3>
              <TrendingUp size={18} className="text-teal-600" />
            </div>

            <div className="relative w-32 h-32 my-2">
              <svg className="w-full h-full -rotate-90">
                <circle cx="50%" cy="50%" r="55" stroke="#f1f5f9" strokeWidth="12" fill="none" />
                <circle
                  cx="50%" cy="50%" r="55"
                  stroke="#0d9488"
                  strokeWidth="12"
                  fill="none"
                  strokeDasharray={2 * Math.PI * 55}
                  strokeDashoffset={2 * Math.PI * 55 * (1 - percentage / 100)}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-slate-800">{percentage}%</span>
                <span className="text-xs text-slate-400 font-medium">Wellness</span>
              </div>
            </div>

            <div className={`px-3 py-1 rounded-full text-xs font-bold border ${severity.bg} ${severity.color} ${severity.border}`}>
              {severity.label} Severity
            </div>

            <p className="text-sm text-slate-600 leading-relaxed px-4">
              {getMessage()}
            </p>

            <div className="flex gap-3 w-full pt-2">
              <button onClick={() => router.push("/assessment")} className="flex-1 border border-slate-200 text-slate-600 py-2 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors">
                Retake Test
              </button>
              <button onClick={() => router.push("/profile")} className="flex-1 bg-teal-600 text-white py-2 rounded-xl text-sm font-medium hover:bg-teal-700 shadow-lg shadow-teal-500/20 transition-all">
                Profile
              </button>
            </div>
          </div>

          {/* QUICK ACTIONS (Breathing & Shaking) */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Breathing Card */}
            <div className="bg-linear-to-br from-teal-600 to-emerald-700 rounded-2xl p-6 text-white shadow-lg shadow-teal-500/20 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Wind size={100} />
              </div>
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                  <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-4">
                    <Wind size={20} className="text-white" />
                  </div>
                  <h3 className="text-lg font-bold">Breathing Exercise</h3>
                  <p className="text-teal-100 text-sm mt-1">Reset your nervous system in 5 mins.</p>
                </div>
                {!isSessionActive ? (
                  <button onClick={startSession} className="mt-4 bg-white text-teal-700 px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-teal-50 transition-colors flex items-center gap-2 w-fit">
                    <Play size={16} fill="currentColor" /> Start Session
                  </button>
                ) : (
                  <div className="mt-4 text-2xl font-mono font-bold bg-black/20 inline-block px-4 py-2 rounded-lg backdrop-blur-sm">
                    {String(Math.floor(secondsLeft / 60)).padStart(2, "0")}:{String(secondsLeft % 60).padStart(2, "0")}
                  </div>
                )}
              </div>
            </div>

            {/* Shaking Card */}
            <div className="bg-linear-to-br from-violet-600 to-purple-700 rounded-2xl p-6 text-white shadow-lg shadow-purple-500/20 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Activity size={100} />
              </div>
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                  <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-4">
                    <Activity size={20} className="text-white" />
                  </div>
                  <h3 className="text-lg font-bold">Shaking Exercise</h3>
                  <p className="text-violet-100 text-sm mt-1">Release physical tension instantly.</p>
                </div>
                {!isShakeActive ? (
                  <button onClick={startShakeSession} className="mt-4 bg-white text-violet-700 px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-violet-50 transition-colors flex items-center gap-2 w-fit">
                    <Play size={16} fill="currentColor" /> Start Shaking
                  </button>
                ) : (
                  <div className="mt-4 text-2xl font-mono font-bold bg-black/20 inline-block px-4 py-2 rounded-lg backdrop-blur-sm">
                    {String(Math.floor(shakeSeconds / 60)).padStart(2, "0")}:{String(shakeSeconds % 60).padStart(2, "0")}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* MIDDLE GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* CHART */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-teal-50 rounded-lg text-teal-600">
                  <TrendingUp size={20} />
                </div>
                <h3 className="font-bold text-slate-800">Progress Overview</h3>
              </div>
              <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-1 rounded-md">Last 10 Assessments</span>
            </div>
            <div className="h-64">
              <ResponsiveContainer>
                <BarChart data={mentalChartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} domain={[0, 75]} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-white p-3 rounded-lg shadow-md border text-sm">
                            <p className="font-semibold">{data.date}</p>
                            <p>Score: {data.score}</p>
                            <p className="font-medium">Severity: {data.severity}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="score" radius={[6, 6, 0, 0]} barSize={40}>
                    {mentalChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              {["Minimal", "Mild", "Moderate", "Severe"].map((level) => (
                <div key={level} className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-lg">
                  <div
                    className={`w-3 h-3 rounded-full ${level === "Minimal"
                      ? "bg-emerald-500"
                      : level === "Mild"
                        ? "bg-yellow-500"
                        : level === "Moderate"
                          ? "bg-orange-500"
                          : "bg-red-500"
                      }`}
                  />
                  <span className="text-slate-600">{level}</span>
                </div>
              ))}
            </div>

          </div>

          {/* TASKS & CALENDAR */}
          <div className="space-y-6">
            {/* Weekly Tasks */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                  <ListTodo size={20} />
                </div>
                <h3 className="font-bold text-slate-800">Weekly Goals</h3>
              </div>
              <div className="space-y-3">
                {weeklyTasks.length > 0 ? (
                  weeklyTasks.map((task) => (
                    <div key={task.id} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors group">
                      <CheckCircle className={`mt-0.5 shrink-0 ${task.completed ? "text-teal-600" : "text-slate-300"}`} size={18} />
                      <span className={`text-sm ${task.completed ? "line-through text-slate-400" : "text-slate-700 font-medium"}`}>
                        {task.text}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6">
                    <p className="text-slate-400 text-sm">No active goals this week</p>
                  </div>
                )}
              </div>
            </div>

            {/* Calendar */}
            <div className="bg-white rounded-2xl p-4 shadow-lg border border-slate-100">
              <Calendar
                value={date}
                onChange={(val) => setDate(val as Date)}
                className="w-full border-none"
              />
            </div>
          </div>
        </div>

        {/* BOTTOM GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* SLEEP INPUT */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <Moon size={80} />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                  <Moon size={20} />
                </div>
                <h3 className="font-bold text-slate-800">Sleep Log</h3>
              </div>
              <p className="text-xs text-slate-500 mb-3">How many hours did you sleep last night?</p>
              <input
                type="number"
                value={sleepHours}
                onChange={(e) => setSleepHours(e.target.value)}
                disabled={isSleepLocked}
                className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl text-sm focus:ring-2 focus:ring-teal-500 outline-none disabled:opacity-50 mb-3"
                placeholder="e.g. 7.5"
              />
              <button
                onClick={saveSleep}
                disabled={isSleepLocked}
                className={`w-full py-2.5 rounded-xl text-sm font-bold transition-all ${isSleepLocked
                  ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                  : "bg-teal-600 text-white hover:bg-teal-700 shadow-lg shadow-teal-500/20"
                  }`}
              >
                {isSleepLocked ? "Logged for Today" : "Save Sleep Data"}
              </button>
              {isSleepLocked && (
                <p className="text-[10px] text-center text-slate-400 mt-2">
                  Next entry available after 6:00 AM
                </p>
              )}
            </div>
          </div>

          {/* WEIGHT INPUT */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5">
              ⚖️
            </div>

            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-pink-50 rounded-lg text-pink-600">
                  ⚖️
                </div>
                <h3 className="font-bold text-slate-800">Weight Log</h3>
              </div>

              <p className="text-xs text-slate-500 mb-3">
                Enter your current weight (kg)
              </p>

              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                disabled={isWeightLocked}
                className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl text-sm focus:ring-2 focus:ring-pink-500 outline-none disabled:opacity-50 mb-3"
                placeholder="e.g. 68"
              />

              <button
                onClick={saveWeight}
                disabled={isWeightLocked}
                className={`w-full py-2.5 rounded-xl text-sm font-bold transition-all ${isWeightLocked
                  ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                  : "bg-pink-600 text-white hover:bg-pink-700 shadow-lg shadow-pink-500/20"
                  }`}
              >
                {isWeightLocked ? "Logged for Today" : "Save Weight"}
              </button>

              {isWeightLocked && (
                <p className="text-[10px] text-center text-slate-400 mt-2">
                  Next entry available after 6:00 AM
                </p>
              )}
            </div>
          </div>

          {/* RECENT TASKS (Full Width Bottom) */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-orange-50 rounded-lg text-orange-600">
                <CheckCircle size={20} />
              </div>
              <h3 className="font-bold text-slate-800">Recent Activity</h3>
            </div>
            <div className="flex flex-col gap-4">
              {recentTasks.length > 0 ? (
                recentTasks.map((task) => (
                  <div key={task.id} className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex  items-center gap-3">
                    <CheckCircle className={`shrink-0 ${task.completed ? "text-teal-600" : "text-slate-300"}`} size={18} />
                    <span className={`text-sm truncate ${task.completed ? "line-through text-slate-400" : "text-slate-700 font-medium"}`}>
                      {task.text}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-slate-400 text-sm col-span-full text-center py-4">No recent tasks completed</p>
              )}
            </div>
          </div>

          {/* SLEEP CHART */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 md:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-800">Sleep History (7 Days)</h3>
              <span className="text-xs text-slate-400">Avg: {(sleepChartData.reduce((a, b) => a + b.hours, 0) / (sleepChartData.length || 1)).toFixed(1)}h</span>
            </div>
            <div className="h-32">
              <ResponsiveContainer>
                <BarChart data={sleepChartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="date" hide />
                  <YAxis hide domain={[0, 12]} />
                  <Tooltip
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="hours" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={30} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-xs text-slate-500 mt-3">
              {getSleepInsight()}
            </p>
          </div>

          {/* WEIGHT CHART */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 md:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-800">Weight History (7 Days)</h3>
              <span className="text-xs text-slate-400">
                Latest: {weightChartData.slice(-1)[0]?.weight || 0} kg
              </span>
            </div>

            <div className="h-32">
              <ResponsiveContainer>
                <LineChart data={weightChartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="date" hide />
                  <YAxis hide />
                  <Tooltip
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="weight"
                    stroke="#ec4899"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <p className="text-xs text-slate-500 mt-3">
              {getWeightInsight()}
            </p>
          </div>
        </div>

      </div>

      {/* ================= IMMERSIVE OVERLAYS ================= */}

      {/* Breathing Overlay */}
      {isSessionActive && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-linear-to-br from-teal-900 to-slate-900 backdrop-blur-md animate-in fade-in duration-500">
          <div className="w-full max-w-md mx-4 text-center text-white p-8">
            <button onClick={exitSession} className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors">
              <X size={24} />
            </button>
            <Wind size={64} className="mx-auto mb-6 text-teal-200 animate-pulse" />
            <h2 className="text-3xl font-light mb-2">Breathe</h2>
            <p className="text-teal-200 text-sm mb-8">Inhale for 4s, Hold for 4s, Exhale for 6s</p>
            <div className="text-7xl font-mono font-bold tracking-wider mb-12 text-white drop-shadow-lg">
              {String(Math.floor(secondsLeft / 60)).padStart(2, "0")}:{String(secondsLeft % 60).padStart(2, "0")}
            </div>
            <button onClick={exitSession} className="px-8 py-3 bg-white text-teal-900 rounded-full font-bold hover:scale-105 transition-transform">
              End Session
            </button>
          </div>
        </div>
      )}

      {/* Shaking Overlay */}
      {isShakeActive && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-linear-to-br from-violet-900 to-slate-900 backdrop-blur-md animate-in fade-in duration-500">
          <div className="w-full max-w-md mx-4 text-center text-white p-8">
            <button onClick={exitShakeSession} className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors">
              <X size={24} />
            </button>
            <Activity size={64} className="mx-auto mb-6 text-violet-200 animate-bounce" />
            <h2 className="text-3xl font-light mb-2">Shake It Off</h2>
            <p className="text-violet-200 text-sm mb-8">Move your body freely. Release the tension.</p>
            <div className="text-7xl font-mono font-bold tracking-wider mb-12 text-white drop-shadow-lg">
              {String(Math.floor(shakeSeconds / 60)).padStart(2, "0")}:{String(shakeSeconds % 60).padStart(2, "0")}
            </div>
            <button onClick={exitShakeSession} className="px-8 py-3 bg-white text-violet-900 rounded-full font-bold hover:scale-105 transition-transform">
              End Session
            </button>
          </div>
        </div>
      )}

      {/* Floating AI Button */}
      <button
        onClick={() => setIsAIOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-r from-teal-500 to-emerald-600 text-white shadow-xl flex items-center justify-center hover:scale-110 transition-all animate-pulse"
      >
        🤖
      </button>
      <AIChatModal
        isOpen={isAIOpen}
        onClose={() => setIsAIOpen(false)}
        userData={aiUserData}
      />
    </div>
  );
}