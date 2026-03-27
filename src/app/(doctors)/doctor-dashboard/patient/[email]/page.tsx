"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Bell, LineChartIcon, Search } from "lucide-react";

type Assessment = {
  score: number;
  percentage: number;
  severity: string;
  created_at: string;
  date?: string;
  index?: number;
};

type Sleep = {
  hours: number;
  created_at: string;
  date?: string;
  index?: number;
};

export default function PatientDetails() {
  const { email } = useParams();
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [sleepData, setSleepData] = useState<Sleep[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const res1 = await fetch(`/api/assessment?email=${email}`);
      const data1 = await res1.json();

      const res2 = await fetch(`/api/sleep?email=${email}`);
      const data2 = await res2.json();

      if (data1.success) {
        const formatted = data1.history
          .sort(
            (a: Assessment, b: Assessment) =>
              new Date(a.created_at).getTime() -
              new Date(b.created_at).getTime()
          )
          .map((a: Assessment, i: number) => ({
            ...a,
            date: new Date(a.created_at).toLocaleDateString(),
            index: i + 1,
          }));

        setAssessments(formatted);
      }

      if (data2.success) {
        const formatted = data2.data.map((s: Sleep, i: number) => ({
          ...s,
          date: new Date(s.created_at).toLocaleDateString(),
          index: i + 1,
        }));
        setSleepData(formatted);
      }

      setLoading(false);
    };

    fetchData();
  }, [email]);

  const latest = assessments[assessments.length - 1];

  if (loading) return <div className="p-10">Loading...</div>;

  function DoctorTaskPanel({ email }: { email: string }) {
    const [text, setText] = useState("");
    const [type, setType] = useState<"daily" | "weekly" | "monthly">("daily");
    const [loading, setLoading] = useState(false);
    const [lastTask, setLastTask] = useState<any>(null);

    const handleAdd = async () => {
      if (!text.trim()) return;

      setLoading(true);

      try {
        const res = await fetch("/api/tasks", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            text,
            type,
          }),
        });

        const data = await res.json();

        if (data.success) {
          setLastTask({
            text,
            type,
            time: new Date().toLocaleTimeString(),
          });

          setText("");
        }
      } catch (err) {
        console.error(err);
      }

      setLoading(false);
    };

    return (
      <div className="space-y-5">

        {/* INPUT CARD */}
        <div className="bg-gray-50 p-4 rounded-xl border">

          <textarea
            placeholder="Write recommendation or assign a task..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full bg-transparent outline-none text-sm resize-none"
            rows={3}
          />

          {/* TYPE SELECTOR */}
          <div className="flex justify-between items-center mt-4">

            <div className="flex gap-2">
              {["daily", "weekly", "monthly"].map((t) => (
                <button
                  key={t}
                  onClick={() => setType(t as any)}
                  className={`px-3 py-1 text-xs rounded-full transition ${type === t
                      ? "bg-teal-600 text-white"
                      : "bg-white border text-gray-500"
                    }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <button
              onClick={handleAdd}
              disabled={loading}
              className="bg-teal-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-teal-700 transition"
            >
              {loading ? "Adding..." : "Add"}
            </button>

          </div>
        </div>

        {/* SUCCESS FEEDBACK */}
        {lastTask && (
          <div className="bg-green-50 border border-green-200 p-4 rounded-xl animate-fade-in">

            <div className="flex justify-between items-center">

              <div>
                <p className="text-sm font-medium text-green-800">
                  Task Added Successfully ✅
                </p>

                <p className="text-sm text-gray-700 mt-1">
                  {lastTask.text}
                </p>

                <p className="text-xs text-gray-400 mt-1">
                  {lastTask.type.toUpperCase()} • {lastTask.time}
                </p>
              </div>

              <span className="text-xs bg-green-200 text-green-700 px-2 py-1 rounded-full">
                Sent
              </span>

            </div>

          </div>
        )}

      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-semibold text-gray-800">
            Patient Stats
          </h1>
          <p className="text-gray-500 text-sm">
            Monitoring progress • {new Date().toDateString()}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center bg-gray-100 px-3 py-2 rounded-full">
            <Search size={16} className="text-gray-400 mr-2" />
            <input
              placeholder="Search insights..."
              className="bg-transparent outline-none text-sm"
            />
          </div>
          <Bell className="text-gray-500" />
          <div className="w-9 h-9 bg-gray-300 rounded-full" />
        </div>
      </div>

      {/* TOP GRID */}
      <div className="grid lg:grid-cols-3 gap-6">

        {/* MAIN CHART */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm">

          <div className="flex justify-between mb-4">
            <div>
              <h3 className="font-semibold text-gray-700">
                Assessment test results
              </h3>
              <p className="text-sm text-gray-500">
                Emotional stability trend
              </p>
            </div>

            <span className="text-green-600 px-3 py-1 rounded-full">
              <LineChartIcon />
            </span>
          </div>

          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={assessments}>
              <XAxis dataKey="index" />
              <YAxis />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="score"
                stroke="#0f766e"
                fill="#0f766e"
                fillOpacity={0.15}
                strokeWidth={3}
              />
            </AreaChart>
          </ResponsiveContainer>

        </div>

        {/* RIGHT CARD */}
        <div className="bg-white max-h-fit rounded-2xl p-6 shadow-sm flex flex-col justify-between">

          <div>
            <h3 className="font-semibold text-gray-700 mb-2">
              Sleep Restorative
            </h3>
            <p className="text-sm text-gray-500">
              Weekly sleep performance
            </p>
          </div>

          <div className="text-4xl font-bold text-teal-700 mt-4">
            {sleepData.length
              ? (
                sleepData.reduce((a, b) => a + b.hours, 0) /
                sleepData.length
              ).toFixed(1)
              : 0}
            <span className="text-lg text-gray-500 ml-1">
              hrs
            </span>
          </div>

          <div className="h-2 bg-gray-200 rounded-full mt-4">
            <div className="h-2 bg-teal-600 w-3/4 rounded-full" />
          </div>

        </div>

      </div>

      {/* MIDDLE GRID */}
      <div className="grid lg:grid-cols-3 gap-6">

        {/* SMALL METRICS */}
        <div className="space-y-6">

          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <p className="text-sm text-gray-500">Latest Score</p>
            <h2 className="text-2xl font-bold mt-2">
              {latest?.score || 0}
            </h2>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <p className="text-sm text-gray-500">Latest %</p>
            <h2 className="text-2xl font-bold mt-2">
              {latest?.percentage || 0}%
            </h2>
          </div>

        </div>

        {/* SMALL WINS */}
        {/* TASK + RECOMMENDATION PANEL */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="font-semibold mb-4">
            Doctor Recommendations & Tasks
          </h3>

          <DoctorTaskPanel email={email as string} />
        </div>

      </div>

      {/* CLINICAL INSIGHT */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">

        <h3 className="text-lg font-semibold text-teal-700 mb-3">
          Clinical Insight
        </h3>

        <p className="text-gray-600 leading-relaxed">
          Patient shows improving trends in emotional stability and sleep
          cycles. Consistent progress suggests effective self-regulation
          and treatment adherence.
        </p>

        <div className="mt-4 text-sm text-gray-500">
          — Doctor Analysis
        </div>

      </div>

      {/* FULL CHART */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">

        <h3 className="font-semibold mb-4">
          Sleep Full Report
        </h3>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={sleepData}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis dataKey="index" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="hours"
              stroke="#0ea5e9"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>

      </div>

    </div>
  );
}