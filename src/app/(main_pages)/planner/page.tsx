"use client";

import { useState, useEffect } from "react";
import {
  Calendar,
  Plus,
  CheckCircle,
  Trash2,
  Trophy,
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

export default function PlannerPage() {
  const [tasks, setTasks] = useState<TasksState>({
    daily: [],
    weekly: [],
    monthly: [],
  });

  const [activeTab, setActiveTab] = useState<keyof TasksState>("daily");
  const [taskInput, setTaskInput] = useState("");

  const email =
    typeof window !== "undefined"
      ? localStorage.getItem("userEmail")
      : null;

  // FETCH TASKS
  useEffect(() => {
    const fetchTasks = async () => {
      if (!email) return;

      const res = await fetch(`/api/tasks?email=${email}`);
      const data = await res.json();

      const grouped: TasksState = {
        daily: [],
        weekly: [],
        monthly: [],
      };

      data.forEach((task: Task) => {
        grouped[task.type].push(task);
      });

      setTasks(grouped);
    };

    fetchTasks();
  }, [email]);

  // FETCH TASKS HELPER
  const fetchTasks = async () => {
    if (!email) return;

    const res = await fetch(`/api/tasks?email=${email}`);
    const data = await res.json();

    const grouped: TasksState = {
      daily: [],
      weekly: [],
      monthly: [],
    };

    data.forEach((task: Task) => {
      grouped[task.type].push(task);
    });

    setTasks(grouped);
  };

  // ADD TASK
  const addTask = async () => {
    if (!taskInput.trim()) return;

    await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        text: taskInput,
        type: activeTab,
      }),
    });

    setTaskInput("");
    fetchTasks();
  };

  // TOGGLE
  const toggleTask = async (task: Task) => {
    await fetch("/api/tasks/complete", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: task.id,
        completed: !task.completed,
        email,
      }),
    });

    fetchTasks();
  };

  // DELETE
  const deleteTask = async (id: number) => {
    await fetch("/api/tasks", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    fetchTasks();
  };

  const completedCount = tasks[activeTab].filter((t) => t.completed).length;
  const totalCount = tasks[activeTab].length;
  const progress = totalCount ? (completedCount / totalCount) * 100 : 0;

  return (
  <div className="min-h-full bg-[#f6f8f7] p-8">
    <div className="max-w-4xl mx-auto space-y-6">

      {/* Header */}
      <div className="flex items-center gap-2">
        <Calendar className="text-[#2f5d50]" />
        <h1 className="text-2xl font-semibold text-gray-900">
          Planner
        </h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 bg-[#eef3f1] p-1 rounded-xl w-fit">
        {(["daily", "weekly", "monthly"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm rounded-lg capitalize transition
              ${
                activeTab === tab
                  ? "bg-white text-[#2f5d50] shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }
            `}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="flex gap-3">
        <input
          value={taskInput}
          onChange={(e) => setTaskInput(e.target.value)}
          placeholder="Add a task..."
          className="flex-1 bg-white px-4 py-3 rounded-xl shadow-sm outline-none focus:ring-2 focus:ring-[#2f5d50]"
        />

        <button
          onClick={addTask}
          className="bg-[#2f5d50] text-white px-5 rounded-xl flex items-center justify-center hover:opacity-90"
        >
          <Plus size={18} />
        </button>
      </div>

      {/* Progress */}
      {totalCount > 0 && (
        <div className="bg-white p-4 rounded-2xl shadow-sm">
          <div className="flex justify-between text-xs text-gray-500 mb-2">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>

          <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
            <div
              className="bg-[#2f5d50] h-2 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Tasks */}
      <div className="space-y-3">
        {tasks[activeTab].map((task) => (
          <div
            key={task.id}
            className="flex justify-between items-center bg-white px-4 py-3 rounded-2xl shadow-sm hover:shadow-md transition"
          >
            <div
              onClick={() => toggleTask(task)}
              className="flex items-center gap-3 cursor-pointer"
            >
              <CheckCircle
                className={
                  task.completed
                    ? "text-green-500"
                    : "text-gray-300"
                }
              />

              <span
                className={`text-sm ${
                  task.completed
                    ? "line-through text-gray-400"
                    : "text-gray-800"
                }`}
              >
                {task.text}
              </span>
            </div>

            <button
              onClick={() => deleteTask(task.id)}
              className="text-gray-400 hover:text-red-500 transition"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {tasks[activeTab].length === 0 && (
        <div className="text-center mt-16 text-gray-400 flex flex-col items-center gap-2">
          <div className="w-14 h-14 rounded-full bg-[#eef3f1] flex items-center justify-center">
            <Trophy className="text-[#2f5d50]" />
          </div>
          <p className="text-sm">No tasks yet</p>
        </div>
      )}

    </div>
  </div>
);
}