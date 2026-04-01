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
import { Bell, Activity, Moon, FileText, Send, CheckCircle2 } from "lucide-react";

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
      try {
        const res1 = await fetch(`/api/assessment?email=${email}`);
        const data1 = await res1.json();

        const res2 = await fetch(`/api/sleep?email=${email}`);
        const data2 = await res2.json();

        if (data1.success) {
          const formatted = data1.history
            .sort(
              (a: Assessment, b: Assessment) =>
                new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
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
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };

    fetchData();
  }, [email]);

  const latest = assessments[assessments.length - 1];
  const avgSleep = sleepData.length ? (sleepData.reduce((a, b) => a + b.hours, 0) / sleepData.length).toFixed(1) : 0;

  if (loading) return <div className="p-10 flex items-center justify-center text-slate-500">Loading patient records...</div>;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-800">Patient Overview</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-bold border border-green-200">
              Active
            </span>
          </div>
          <p className="text-slate-500 text-sm mt-1">
            Email: <span className="font-medium text-slate-700">{email}</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
            <Bell size={20} />
          </button>
          <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors">
            Export Report
          </button>
        </div>
      </div>

      {/* TOP METRICS & CHARTS */}
      <div className="grid lg:grid-cols-3 gap-6">

        {/* Main Assessment Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <Activity className="text-blue-600" size={20} />
                Emotional Stability Trend
              </h3>
              <p className="text-xs text-slate-500 mt-1">Based on weekly assessment scores</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-400 font-medium uppercase">Current Score</p>
              <p className="text-2xl font-bold text-blue-600">{latest?.score || 0}</p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={assessments}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="index" hide />
                <YAxis hide domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  cursor={{ stroke: '#cbd5e1', strokeWidth: 1 }}
                />
                <Area
                  type="monotone"
                  dataKey="score"
                  stroke="#2563eb"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorScore)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sleep Stats Card */}
        <div className="bg-linear-to-br from-teal-600 to-teal-800 rounded-2xl p-6 shadow-lg text-white flex flex-col justify-between relative overflow-hidden">
          {/* Decorative Circle */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>

          <div>
            <h3 className="font-bold text-teal-50 flex items-center gap-2">
              <Moon className="text-teal-200" size={20} />
              Sleep Restorative
            </h3>
            <p className="text-teal-100 text-xs mt-1 opacity-80">Average weekly sleep duration</p>
          </div>

          <div className="mt-8">
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-bold tracking-tight">{avgSleep}</span>
              <span className="text-lg text-teal-200 font-medium">hours</span>
            </div>

            <div className="w-full bg-teal-900/30 rounded-full h-2 mt-6 backdrop-blur-sm">
              <div 
                className="h-2 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)]" 
                style={{ width: `${Math.min((Number(avgSleep) / 10) * 100, 100)}%` }} 
              />
            </div>
            <p className="text-xs text-teal-200 mt-2 text-right">Target: 8.0 hrs</p>
          </div>
        </div>
      </div>

      {/* MIDDLE SECTION: Metrics & Tasks */}
      <div className="grid lg:grid-cols-3 gap-6">

        {/* Quick Stats Column */}
        <div className="space-y-4">
          <StatBox label="Latest Severity" value={latest?.severity || "N/A"} color="text-orange-600" bg="bg-orange-50" />
          <StatBox label="Assessment %" value={`${latest?.percentage || 0}%`} color="text-blue-600" bg="bg-blue-50" />
          <StatBox label="Total Records" value={assessments.length} color="text-slate-600" bg="bg-slate-100" />
        </div>

        {/* Doctor Task Panel */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            <FileText className="text-slate-400" size={20} />
            Clinical Notes & Tasks
          </h3>
          <DoctorTaskPanel email={email as string} />
        </div>
      </div>

      {/* Clinical Insight Box */}
      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6">
        <h3 className="text-blue-800 font-bold mb-2 flex items-center gap-2">
          <CheckCircle2 size={20} />
          AI Clinical Insight
        </h3>
        <p className="text-blue-900/80 leading-relaxed text-sm">
          Patient shows <span className="font-semibold">improving trends</span> in emotional stability and sleep cycles. 
          Consistent progress suggests effective self-regulation and treatment adherence. 
          Recommend continuing current monitoring protocol.
        </p>
      </div>

      {/* Sleep Chart */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <h3 className="font-bold text-slate-800 mb-6">Detailed Sleep History</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sleepData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="index" tick={{fontSize: 12, fill: '#94a3b8'}} axisLine={false} tickLine={false} />
              <YAxis tick={{fontSize: 12, fill: '#94a3b8'}} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Line
                type="monotone"
                dataKey="hours"
                stroke="#0d9488"
                strokeWidth={3}
                dot={{ r: 4, fill: '#0d9488', strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 6, fill: '#0d9488' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}

// Sub-components for cleaner code
function StatBox({ label, value, color, bg }: any) {
  return (
    <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between">
      <div>
        <p className="text-xs text-slate-500 font-medium uppercase">{label}</p>
        <p className={`text-xl font-bold mt-1 ${color}`}>{value}</p>
      </div>
      <div className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center`}>
        <div className={`w-2 h-2 rounded-full ${color.replace('text-', 'bg-')}`}></div>
      </div>
    </div>
  );
}

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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, text, type }),
      });
      const data = await res.json();
      if (data.success) {
        setLastTask({ text, type, time: new Date().toLocaleTimeString() });
        setText("");
        setTimeout(() => setLastTask(null), 4000); // Auto hide success msg
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-4">
      {/* Input Area */}
      <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all">
        <textarea
          placeholder="Write a clinical recommendation or assign a task..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full bg-transparent outline-none text-sm text-slate-700 placeholder:text-slate-400 resize-none h-24"
        />
        <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-200">
          <div className="flex gap-2">
            {(["daily", "weekly", "monthly"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setType(t)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all capitalize ${
                  type === t
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                    : "bg-white text-slate-500 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          <button
            onClick={handleAdd}
            disabled={loading || !text.trim()}
            className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loading ? "Saving..." : <><Send size={14} /> Assign</>}
          </button>
        </div>
      </div>

      {/* Success Feedback Toast */}
      {lastTask && (
        <div className="bg-green-50 border border-green-200 p-4 rounded-xl flex items-start gap-3 animate-in slide-in-from-top-2 fade-in duration-300">
          <div className="bg-green-100 p-1.5 rounded-full text-green-600 mt-0.5">
            <CheckCircle2 size={16} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-green-800">Task Assigned Successfully</p>
            <p className="text-sm text-green-700 mt-0.5">{lastTask.text}</p>
            <p className="text-xs text-green-600/70 mt-1 font-medium">
              {lastTask.type.toUpperCase()} • {lastTask.time}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}