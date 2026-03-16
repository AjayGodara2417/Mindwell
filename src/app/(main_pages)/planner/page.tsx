"use client";
import { useState, useEffect } from "react";
import { Calendar, Plus, CheckCircle, Trash2, LayoutList, Trophy } from "lucide-react";

type Task = {
  text: string;
  completed: boolean;
};

type TasksState = {
  daily: Task[];
  weekly: Task[];
  monthly: Task[];
};

export default function PlannerPage() {
  const [tasks, setTasks] = useState<TasksState>(() => {
    let saved: string | null = null;
    if (typeof window !== "undefined") {
      saved = localStorage.getItem("planner-tasks");
    }
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return {
          daily: [],
          weekly: [],
          monthly: [],
        };
      }
    }
    return {
      daily: [],
      weekly: [],
      monthly: [],
    };
  });

  const [activeTab, setActiveTab] = useState<keyof TasksState>("daily");
  const [taskInput, setTaskInput] = useState("");

  useEffect(() => {
    localStorage.setItem("planner-tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (!taskInput.trim()) return;

    const newTask: Task = {
      text: taskInput,
      completed: false,
    };

    setTasks((prev) => ({
      ...prev,
      [activeTab]: [newTask, ...prev[activeTab]],
    }));

    setTaskInput("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") addTask();
  };

  const toggleTask = (index: number) => {
    setTasks((prev) => ({
      ...prev,
      [activeTab]: prev[activeTab].map((task, i) =>
        i === index ? { ...task, completed: !task.completed } : task
      ),
    }));
  };

  const deleteTask = (index: number) => {
    setTasks((prev) => ({
      ...prev,
      [activeTab]: prev[activeTab].filter((_, i) => i !== index),
    }));
  };

  const completedCount = tasks[activeTab].filter((t) => t.completed).length;
  const totalCount = tasks[activeTab].length;
  const progressPercent = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <div className="min-h-screen w-full bg-gray-50 text-gray-800 p-6 md:p-12 font-sans">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <Calendar className="text-indigo-600" size={32} />
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-gray-900">
                My Planner
              </h1>
            </div>

            <p className="text-gray-500 text-lg">
              Organize your journey, one {activeTab.replace("ly", "")} step at a time.
            </p>
          </div>

          {totalCount > 0 && (
            <div className="bg-white p-4 rounded-xl border shadow-sm min-w-45">
              <div className="flex justify-between text-sm mb-2 text-gray-500">
                <span>Progress</span>
                <span>{Math.round(progressPercent)}%</span>
              </div>

              <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-indigo-500 h-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}
        </header>

        {/* Tabs */}
        <div className="flex bg-white rounded-xl p-1.5 w-full md:w-fit mb-8 border shadow-sm">
          {(["daily", "weekly", "monthly"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 md:flex-none px-8 py-2.5 rounded-lg font-medium capitalize transition ${
                activeTab === tab
                  ? "bg-indigo-500 text-white shadow"
                  : "text-gray-500 hover:text-gray-800 hover:bg-gray-100"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Input */}
        <div className="flex items-center gap-4 bg-white p-2 pl-5 rounded-xl border shadow-sm focus-within:ring-2 focus-within:ring-indigo-400">
          <LayoutList className="text-gray-400" size={20} />

          <input
            value={taskInput}
            onChange={(e) => setTaskInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder={`What's on your ${activeTab} list?`}
            className="flex-1 bg-transparent outline-none text-gray-700 placeholder:text-gray-400 py-3"
          />

          <button
            onClick={addTask}
            className="flex items-center gap-2 bg-indigo-500 px-6 py-3 rounded-lg hover:bg-indigo-600 active:scale-95 transition text-white font-semibold"
          >
            <Plus size={18} />
            Add Task
          </button>
        </div>

        {/* Tasks */}
        <div className="mt-8 space-y-3">
          {tasks[activeTab].map((task, index) => (
            <div
              key={index}
              className={`group flex items-center justify-between p-4 rounded-xl border transition ${
                task.completed
                  ? "bg-green-50 border-green-200"
                  : "bg-white border-gray-200 hover:border-indigo-300 shadow-sm"
              }`}
            >
              <div
                className="flex items-center gap-4 cursor-pointer flex-1"
                onClick={() => toggleTask(index)}
              >
                <CheckCircle
                  className={`${
                    task.completed ? "text-green-500" : "text-gray-400"
                  }`}
                  size={24}
                />

                <span
                  className={`text-lg ${
                    task.completed
                      ? "line-through text-gray-400"
                      : "text-gray-700"
                  }`}
                >
                  {task.text}
                </span>
              </div>

              <button
                onClick={() => deleteTask(index)}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))}
        </div>

        {/* Empty */}
        {tasks[activeTab].length === 0 && (
          <div className="flex flex-col items-center justify-center mt-20 text-center">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-4 border shadow-sm">
              <Trophy className="text-gray-300" size={40} />
            </div>

            <h3 className="text-xl font-semibold text-gray-700">
              Clean Slate!
            </h3>

            <p className="text-gray-500 mt-2 max-w-xs">
              Your {activeTab} list is empty. Add a task to get things moving.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}