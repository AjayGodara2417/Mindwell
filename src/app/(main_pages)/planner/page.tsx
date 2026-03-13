"use client";
import { useState, useEffect } from "react";
import { Calendar, Plus, CheckCircle, Trash2, LayoutList, Trophy } from "lucide-react";

// Define Types
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
        // fallback to default if parsing fails
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

  // Save to LocalStorage whenever tasks change
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
      [activeTab]: [newTask, ...prev[activeTab]], // New tasks at the top
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

  // Calculate Progress
  const completedCount = tasks[activeTab].filter((t) => t.completed).length;
  const totalCount = tasks[activeTab].length;
  const progressPercent = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <div className="min-h-screen w-full bg-[#0b1730] text-white p-6 md:p-12 font-sans">
      <div className="max-w-4xl mx-auto">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Calendar className="text-purple-400" size={32} />
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight">My Planner</h1>
            </div>
            <p className="text-gray-400 text-lg">
              Organize your journey, one {activeTab.replace('ly', '')} step at a time.
            </p>
          </div>

          {/* Progress Mini-Card */}
          {totalCount > 0 && (
            <div className="bg-[#16243e] p-4 rounded-2xl border border-white/5 min-w-50">
              <div className="flex justify-between text-sm mb-2 text-gray-400">
                <span>Progress</span>
                <span>{Math.round(progressPercent)}%</span>
              </div>
              <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-purple-500 h-full transition-all duration-500" 
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}
        </header>

        {/* Tab Navigation */}
        <div className="flex bg-[#16243e] rounded-2xl p-1.5 w-full md:w-fit mb-8 shadow-xl border border-white/5">
          {(["daily", "weekly", "monthly"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 md:flex-none px-8 py-2.5 rounded-xl font-medium capitalize transition-all duration-200 ${
                activeTab === tab
                  ? "bg-purple-500 shadow-lg text-white"
                  : "text-gray-400 hover:text-gray-200 hover:bg-white/5"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Input Field */}
        <div className="group relative flex items-center gap-4 bg-[#16243e] p-2 pl-5 rounded-2xl border border-gray-700 focus-within:border-purple-500 transition-all shadow-2xl">
          <LayoutList className="text-gray-500" size={20} />
          <input
            value={taskInput}
            onChange={(e) => setTaskInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder={`What's on your ${activeTab} list?`}
            className="flex-1 bg-transparent outline-none text-gray-200 placeholder:text-gray-600 py-3"
          />
          <button
            onClick={addTask}
            className="flex items-center gap-2 bg-purple-500 px-6 py-3 rounded-xl hover:bg-purple-600 active:scale-95 transition-all font-semibold"
          >
            <Plus size={18} />
            Add Task
          </button>
        </div>

        {/* Task List Container */}
        <div className="mt-8 space-y-3">
          {tasks[activeTab].map((task, index) => (
            <div
              key={index}
              className={`group flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 ${
                task.completed 
                ? "bg-green-500/5 border-green-500/20 opacity-75" 
                : "bg-[#16243e] border-white/5 hover:border-purple-500/30 shadow-md"
              }`}
            >
              <div
                className="flex items-center gap-4 cursor-pointer flex-1"
                onClick={() => toggleTask(index)}
              >
                <div className={`transition-transform duration-200 ${task.completed ? "scale-110" : "group-hover:scale-110"}`}>
                   <CheckCircle
                    className={`${task.completed ? "text-green-500" : "text-gray-600"}`}
                    size={24}
                  />
                </div>
                <span className={`text-lg transition-all ${
                    task.completed ? "line-through text-gray-500" : "text-gray-200"
                  }`}>
                  {task.text}
                </span>
              </div>

              <button 
                onClick={() => deleteTask(index)}
                className="p-2 text-gray-600 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {tasks[activeTab].length === 0 && (
          <div className="flex flex-col items-center justify-center mt-20 text-center animate-in fade-in zoom-in duration-500">
            <div className="w-20 h-20 bg-[#16243e] rounded-full flex items-center justify-center mb-4 border border-white/5">
                <Trophy className="text-gray-700" size={40} />
            </div>
            <h3 className="text-xl font-semibold text-gray-300">Clean Slate!</h3>
            <p className="text-gray-500 mt-2 max-w-62.5">
              Your {activeTab} list is empty. Add a task to get things moving.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}