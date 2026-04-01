"use client";

import { useState, useEffect } from "react";
import {
  Calendar,
  Plus,
  CheckCircle,
  Trash2,
  Trophy,
  Sparkles,
  Clock
} from "lucide-react";

type Task = {
  id: number;
  text: string;
  completed: boolean;
  type: "daily" | "weekly" | "monthly";
};

type TasksState = {
  daily: Task[];
  weekly: Task[];
  monthly: Task[];
};

const suggestedTasks = [
  { id: 1, text: "Go for a 10-minute walk outdoors", tag: "Mood Booster", color: "text-emerald-600 bg-emerald-50" },
  { id: 2, text: "Write down 3 things you're grateful for", tag: "Gratitude", color: "text-blue-600 bg-blue-50" },
  { id: 3, text: "Practice deep breathing for 5 minutes", tag: "Relaxation", color: "text-purple-600 bg-purple-50" },
  { id: 4, text: "Avoid social media for 1 hour", tag: "Detox", color: "text-orange-600 bg-orange-50" },
  { id: 5, text: "Talk to a friend or family member", tag: "Connection", color: "text-pink-600 bg-pink-50" },
  { id: 6, text: "Listen to calming music", tag: "Stress Relief", color: "text-teal-600 bg-teal-50" },
];

export default function PlannerPage() {
  const [tasks, setTasks] = useState<TasksState>({ daily: [], weekly: [], monthly: [] });
  const [activeTab, setActiveTab] = useState<keyof TasksState>("daily");
  const [taskInput, setTaskInput] = useState("");
  const [loading, setLoading] = useState(false);

  const email = typeof window !== "undefined" ? localStorage.getItem("userEmail") : null;

  const fetchTasks = async () => {
    if (!email) return;
    try {
      const res = await fetch(`/api/tasks?email=${email}`);
      const data = await res.json();
      const grouped: TasksState = { daily: [], weekly: [], monthly: [] };
      data.forEach((task: Task) => grouped[task.type].push(task));
      setTasks(grouped);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [email]);

  const addTask = async () => {
    if (!taskInput.trim()) return;
    setLoading(true);
    await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, text: taskInput, type: activeTab }),
    });
    setTaskInput("");
    await fetchTasks();
    setLoading(false);
  };

  const toggleTask = async (task: Task) => {
    await fetch("/api/tasks/complete", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: task.id, completed: !task.completed, email }),
    });
    fetchTasks();
  };

  const deleteTask = async (id: number) => {
    await fetch("/api/tasks", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchTasks();
  };

  const addSuggestedTask = async (text: string) => {
    setLoading(true);
    await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, text, type: "daily" }),
    });
    await fetchTasks();
    setLoading(false);
  };

  const completedCount = tasks[activeTab].filter((t) => t.completed).length;
  const totalCount = tasks[activeTab].length;
  const progress = totalCount ? (completedCount / totalCount) * 100 : 0;

  return (
    <div className="bg-slate-50 min-h-screen p-6 md:p-8 animate-in fade-in duration-500">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-teal-100 rounded-xl text-teal-700">
              <Calendar size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Task Planner</h1>
              <p className="text-slate-500 text-sm">Organize your goals and track progress.</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
            {(["daily", "weekly", "monthly"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm font-medium rounded-lg capitalize transition-all duration-200 ${
                  activeTab === tab
                    ? "bg-teal-600 text-white shadow-md"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Input Area */}
        <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-100 flex gap-2">
          <input
            value={taskInput}
            onChange={(e) => setTaskInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addTask()}
            placeholder={`Add a new ${activeTab} task...`}
            className="flex-1 bg-transparent px-4 py-3 outline-none text-slate-700 placeholder:text-slate-400"
          />
          <button
            onClick={addTask}
            disabled={loading || !taskInput.trim()}
            className="bg-teal-600 hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 rounded-xl flex items-center justify-center transition-all shadow-lg shadow-teal-500/20"
          >
            {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Plus size={20} />}
          </button>
        </div>

        {/* Progress Bar */}
        {totalCount > 0 && (
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex justify-between items-end mb-3">
              <div>
                <p className="text-sm font-semibold text-slate-700">Progress</p>
                <p className="text-xs text-slate-400 mt-0.5">{completedCount} of {totalCount} tasks completed</p>
              </div>
              <span className="text-lg font-bold text-teal-600">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-teal-500 to-emerald-500 h-full rounded-full transition-all duration-700 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Task List */}
        <div className="space-y-3">
          {tasks[activeTab].length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-200">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="text-slate-300" size={32} />
              </div>
              <h3 className="text-slate-800 font-medium">No tasks yet</h3>
              <p className="text-slate-500 text-sm mt-1">Add a task above or pick a suggestion below.</p>
            </div>
          ) : (
            tasks[activeTab].map((task) => (
              <div
                key={task.id}
                className="group flex justify-between items-center bg-white px-5 py-4 rounded-2xl shadow-sm border border-slate-100 hover:border-teal-200 hover:shadow-md transition-all duration-200"
              >
                <div
                  onClick={() => toggleTask(task)}
                  className="flex items-center gap-4 cursor-pointer flex-1"
                >
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                    task.completed ? "bg-teal-600 border-teal-600" : "border-slate-300 group-hover:border-teal-400"
                  }`}>
                    {task.completed && <CheckCircle size={14} className="text-white" />}
                  </div>
                  <span className={`text-sm font-medium transition-all ${
                    task.completed ? "line-through text-slate-400" : "text-slate-700"
                  }`}>
                    {task.text}
                  </span>
                </div>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="text-slate-300 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Suggested Tasks */}
        <div className="pt-8">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="text-amber-500" size={20} />
            <h2 className="text-lg font-bold text-slate-800">Suggested for You</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {suggestedTasks.map((task) => (
              <div
                key={task.id}
                className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md hover:border-teal-100 transition-all duration-200 flex flex-col justify-between h-full"
              >
                <div>
                  <p className="text-sm font-medium text-slate-700 leading-relaxed mb-3">
                    {task.text}
                  </p>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md ${task.color}`}>
                    {task.tag}
                  </span>
                </div>
                <button
                  onClick={() => addSuggestedTask(task.text)}
                  className="mt-4 w-full py-2 bg-slate-50 hover:bg-teal-50 text-slate-600 hover:text-teal-700 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <Plus size={14} /> Add to Daily
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}