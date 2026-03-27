"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { TrendingUp, CheckCircle } from "lucide-react";

import {
  Assessment,
  SleepEntry,
  Task,
  Profile,
  AssessmentResponse,
  SleepResponse,
  IntervalRef,
  TaskType,
} from "@/types/dashboard";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { useRouter } from "next/navigation";

export default function Stats() {
  return (
      <Suspense fallback={<div className="p-6">Loading...</div>}>
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

  const [isSessionActive, setIsSessionActive] = useState<boolean>(false);
  const [secondsLeft, setSecondsLeft] = useState<number>(0);
  const intervalRef = useRef<IntervalRef>(null);

  const [isShakeActive, setIsShakeActive] = useState<boolean>(false);
  const [shakeSeconds, setShakeSeconds] = useState<number>(0);
  const shakeIntervalRef = useRef<IntervalRef>(null);

  const router = useRouter();

  const email =
    typeof window !== "undefined" ? localStorage.getItem("userEmail") : null;

  // ================= TIMER LOGIC =================
  const startSession = () => {
    setSecondsLeft(300);
    setIsSessionActive(true);

    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          if (intervalRef.current !== null) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
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
          if (shakeIntervalRef.current !== null) {
            clearInterval(shakeIntervalRef.current);
          }
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

  // ================= CLEANUP =================
  useEffect(() => {
    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
      if (shakeIntervalRef.current !== null) {
        clearInterval(shakeIntervalRef.current);
      }
    };
  }, []);

  // ================= FETCH DATA =================
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

        // ===== Assessments =====
        const assessRes = await fetch(
          `/api/assessment?email=${profile.email}`
        );

        const assess: AssessmentResponse = await assessRes.json();

        if (assess.success && Array.isArray(assess.history)) {
          const sorted = assess.history
            .sort(
              (a, b) =>
                new Date(a.created_at).getTime() -
                new Date(b.created_at).getTime()
            )
            .slice(-10);

          setAssessments(sorted);
        }

        // ===== Sleep =====
        const sleepRes = await fetch(
          `/api/sleep?email=${profile.email}`
        );

        const sleep: SleepResponse = await sleepRes.json();

        if (sleep.success) setSleepData(sleep.data);

        // ===== Tasks =====
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

    // Clone date
    const adjusted = new Date(now);

    // If before 6 AM → treat as previous day
    if (now.getHours() < 6) {
      adjusted.setDate(adjusted.getDate() - 1);
    }

    return adjusted.toISOString().split("T")[0]; // YYYY-MM-DD
  };

  const [isSleepLocked, setIsSleepLocked] = useState(() => {
    if (typeof window === "undefined") return false;

    const last = localStorage.getItem("lastSleepEntry");
    const todayKey = getSleepDayKey();

    return last === todayKey;
  });

  // ================= DERIVED DATA =================
  const latest: Assessment | undefined =
    assessments[assessments.length - 1];

  const mentalChartData = assessments.map((item) => ({
    score: item.score,
    date: new Date(item.created_at).toLocaleDateString(),
  }));

  const endDate = new Date();
  endDate.setHours(23, 59, 59, 999);

  const startDate = new Date();
  startDate.setDate(endDate.getDate() - 6);
  startDate.setHours(0, 0, 0, 0);

  const sleepChartData = sleepData
    .map((item: SleepEntry) => {
      const d = new Date(
        item.created_at ?? item.date ?? item.timestamp ?? ""
      );
      return { ...item, _dateObj: d };
    })
    .filter(
      (item) =>
        item._dateObj &&
        item._dateObj >= startDate &&
        item._dateObj <= endDate
    )
    .sort((a, b) => a._dateObj.getTime() - b._dateObj.getTime())
    .slice(-7)
    .map((item) => ({
      hours: item.hours,
      date: item._dateObj.toLocaleDateString(),
    }));

  // ================= SAVE SLEEP =================
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
        body: JSON.stringify({
          email: profile.email,
          hours: Number(sleepHours),
        }),
      });

      // ✅ STORE LOCK
      const key = getSleepDayKey();
      localStorage.setItem("lastSleepEntry", key);

      setIsSleepLocked(true);
      setSleepHours("");

      const updated = await fetch(
        `/api/sleep?email=${profile.email}`
      ).then((r) => r.json());

      if (updated.success) setSleepData(updated.data);

    } catch (err) {
      console.error("Sleep save error:", err);
    }
  };

  const score = latest?.score || 0;
  const percentage = Math.round((score / 75) * 100);

  const getSeverity = () => {
    if (score <= 9) return { label: "Minimal", color: "text-green-600" };
    if (score <= 19) return { label: "Mild", color: "text-yellow-500" };
    if (score <= 29) return { label: "Moderate", color: "text-orange-500" };
    return { label: "Severe", color: "text-red-500" };
  };

  const severity = getSeverity();

  const getMessage = () => {
    if (score <= 9)
      return "Your responses indicate minimal signs of depression. Keep maintaining a healthy lifestyle and stay connected with loved ones.";
    if (score <= 19)
      return "You may be experiencing mild symptoms. Consider small lifestyle changes and self-care routines.";
    if (score <= 29)
      return "Moderate symptoms detected. It may help to talk to someone or seek guidance.";
    return "Severe symptoms detected. Please consider reaching out to a professional for support.";
  };

  // ================= LOADING =================
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-500">
        Loading...
      </div>
    );
  }

  return (
    <div className="bg-[#f6f8f7] p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* HEADER */}
        <div>
          <h1 className="text-2xl font-semibold">Welcome back 👋</h1>
          <p className="text-gray-500 text-sm">
            Track your mental wellness and sleep patterns daily.
          </p>
        </div>

        {/* TOP GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-4 shadow-xl flex flex-col max-h-fit items-center text-center space-y-2">

            <p className="text-sm text-gray-500">Latest Score</p>

            <div className="flex gap-6 items-center">

            {/* Circle Progress */}
            <div className="relative w-28 h-28">
              <svg className="w-full h-full -rotate-90">
                <circle
                  cx="50%"
                  cy="50%"
                  r="45"
                  stroke="#e5e7eb"
                  strokeWidth="10"
                  fill="none"
                />
            
                <circle
                  cx="50%"
                  cy="50%"
                  r="45"
                  stroke="#2f5d50"
                  strokeWidth="10"
                  fill="none"
                  strokeDasharray={2 * Math.PI * 45}
                  strokeDashoffset={
                    2 * Math.PI * 45 * (1 - percentage / 100)
                  }
                  strokeLinecap="round"
                />
              </svg>

              <div className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-gray-700">
                {percentage}%
              </div>
            </div>
            {/* Score */}
            <h2 className="text-4xl font-bold text-[#2f5d50]">
              {score} <span className="text-gray-400 text-lg">/ 75</span>
            </h2>
            </div>

            {/* Severity */}
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-green-500 rounded-full" />
              <p className={`font-medium ${severity.color}`}>
                {severity.label}
              </p>
              <span className="text-gray-400 text-sm">({percentage}%)</span>
            </div>

            {/* Message */}
            <p className="text-sm text-gray-600 max-w-xs">
              {getMessage()}
            </p>

            {/* Actions */}
            <div className="flex gap-3 w-full pt-2">
              <button
                onClick={() => router.push("/assessment")}
                className="flex-1 border border-gray-300 py-2 rounded-lg text-sm hover:bg-gray-50"
              >
                Retake Test
              </button>

              <button
                onClick={() => router.push("/stats")}
                className="flex-1 bg-[#2f5d50] text-white py-2 rounded-lg text-sm hover:opacity-90"
              >
                View Stats
              </button>
            </div>

          </div>

          <div className="flex flex-col gap-4">
            <div className="bg-[#2f5d50] text-white shadow-lg max-h-fit rounded-2xl p-4 px-6 flex flex-col justify-between relative">
              {/* Card content when session is not active */}
              {!isSessionActive && (
                <>
                  <div>
                    <h3 className="text-lg font-semibold">Feeling Overwhelmed?</h3>
                    <p className="text-sm opacity-80">
                      Take a 5-minute breathing exercise to reset your nervous system.
                    </p>
                  </div>
                  <button
                    onClick={startSession}
                    className="mt-4 bg-white text-[#2f5d50] px-4 py-2 rounded-lg text-sm font-medium w-fit"
                  >
                    Start Session
                  </button>
                </>
              )}

              {/* Overlay shown while session is active */}
              {isSessionActive && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-95">
                  <div className="w-full max-w-md mx-4 text-center text-white">
                    <h2 className="text-2xl font-semibold mb-4">Breathing Session</h2>

                    {/* Timer display */}
                    <div className="text-6xl font-bold tracking-wider mb-6">
                      {String(Math.floor(secondsLeft / 60)).padStart(2, "0")}:
                      {String(secondsLeft % 60).padStart(2, "0")}
                    </div>

                    {/* Simple breathing cue (optional) */}
                    <p className="text-sm opacity-80 mb-6">
                      Breathe in for 4 seconds, hold for 4, breathe out for 6. Repeat.
                    </p>

                    <div className="flex justify-center gap-4">
                      <button
                        onClick={exitSession}
                        className="bg-white text-[#2f5d50] px-4 py-2 rounded-lg font-medium"
                      >
                        Exit
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* SHAKING EXERCISE CARD */}
            <div className="bg-linear-to-br from-purple-300 to-violet-500 text-white shadow-lg rounded-2xl p-4 px-6 flex flex-col justify-between">
              {!isShakeActive && (
                <>
                  <div>
                    <h3 className="text-lg font-semibold">Release Stress Fast</h3>
                    <p className="text-sm opacity-80 ">
                      Do a 5-minute shaking exercise to release tension from your body.
                    </p>
                  </div>
                  <button
                    onClick={startShakeSession}
                    className="mt-4 bg-white text-purple-600 px-4 py-2 rounded-lg text-sm font-medium w-fit"
                  >
                    Start Shaking
                  </button>
                </>
              )}

              {isShakeActive && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-95">
                  <div className="w-full max-w-md mx-4 text-center text-white">
                    <h2 className="text-2xl font-semibold mb-4">Shaking Exercise</h2>

                    <div className="text-6xl font-bold tracking-wider mb-6">
                      {String(Math.floor(shakeSeconds / 60)).padStart(2, "0")}:
                      {String(shakeSeconds % 60).padStart(2, "0")}
                    </div>

                    <p className="text-sm opacity-80 mb-6">
                      Shake your hands, wrists, shoulders, and body freely.
                      Let go of tension. Keep breathing naturally.
                    </p>

                    <div className="flex justify-center gap-4">
                      <button
                        onClick={exitShakeSession}
                        className="bg-white text-purple-600 px-4 py-2 rounded-lg font-medium"
                      >
                        Exit
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-xl">
            <Calendar
              value={date}
              onChange={(val) => setDate(val as Date)}
              className="border-none! w-full! text-sm"
              tileClassName="rounded-lg hover:bg-[#e6f0ed]"
            />
          </div>
        </div>

        {/* MIDDLE GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="text-[#2f5d50]" />
                <h2 className="font-medium">Depression test score</h2>
              </div>
              <div className="text-xs text-gray-400">Last 10 assessments</div>
            </div>

            <div className="h-64">
              <ResponsiveContainer>
                <BarChart data={mentalChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, 75]} />
                  <Tooltip />
                  <Bar dataKey="score" fill="#2f5d50" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-5 shadow-xl">
              <h3 className="font-medium mb-4">Weekly Tasks</h3>
              <div className="space-y-2">
                {weeklyTasks.length > 0 ? (
                  weeklyTasks.map((task) => (
                    <div
                      key={task.id}
                      className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <CheckCircle
                        className={
                          task.completed
                            ? "text-[#2f5d50] shrink-0"
                            : "text-gray-300 shrink-0"
                        }
                        size={18}
                      />
                      <span
                        className={
                          task.completed
                            ? "line-through text-gray-400 text-sm"
                            : "text-gray-700 text-sm"
                        }
                      >
                        {task.text}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 text-sm text-center py-4">No tasks for this week</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* SLEEP TRACKER */}
          <div className="bg-pink-200 max-h-fit p-6 rounded-2xl shadow-xl">
            <h2 className="font-medium mb-3">Sleep Tracker</h2>
            <p className="text-sm text-gray-400 mb-2">Last Night Sleep (hrs)</p>
            <input
              type="number"
              value={sleepHours}
              onChange={(e) => setSleepHours(e.target.value)}
              disabled={isSleepLocked}
              className="w-full bg-gray-100 px-4 py-2 rounded-lg mb-3 disabled:opacity-50"
              placeholder="7.5"
            />

            <button
              onClick={saveSleep}
              disabled={isSleepLocked}
              className="w-full bg-[#2f5d50] text-white py-2 rounded-lg disabled:opacity-50"
            >
              {isSleepLocked ? "Already Logged Today" : "Save Progress"}
            </button>
            {isSleepLocked && (
              <p className="text-xs text-gray-500 mt-2 text-center">
                You can log sleep again after 6:00 AM tomorrow.
              </p>
            )}
          </div>

          {/* SLEEP CHART */}
          <div className="bg-white max-h-fit p-6 rounded-2xl shadow-xl">
            <h2 className="font-medium mb-3">Sleep History</h2>
            <div className="h-32">
              <ResponsiveContainer>
                <BarChart data={sleepChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="date" hide />
                  <YAxis hide />
                  <Tooltip />
                  <Bar dataKey="hours" fill="#2f5d50" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          {/* RECENT HISTORY (CONNECTED) */}
          <div className="bg-[#2f5d50] text-white p-6 max-h-fit rounded-2xl shadow-2xl">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="text-[#2f5d50]" size={20} />
              <h2 className="font-semibold">Recent Tasks</h2>
            </div>

            <div className="space-y-3">
              {recentTasks.length > 0 ? (
                recentTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center gap-3 p-3 hover:rounded-xl rounded-lg bg-[#f0f4f3] transition-colors"
                  >
                    <CheckCircle
                      className={
                        task.completed
                          ? "text-[#2f5d50] shrink-0"
                          : "text-gray-300 shrink-0"
                      }
                      size={18}
                    />
                    <span
                      className={
                        task.completed
                          ? "line-through text-gray-400 text-sm"
                          : "text-gray-700 text-sm"
                      }
                    >
                      {task.text}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-sm text-center py-4">No recent tasks</p>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}