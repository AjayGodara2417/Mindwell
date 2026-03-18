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
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-4xl mx-auto">

        <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
          <Calendar /> Planner
        </h1>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {(["daily", "weekly", "monthly"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded ${
                activeTab === tab
                  ? "bg-indigo-500 text-white"
                  : "bg-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Input */}
        <div className="flex gap-3 mb-6">
          <input
            value={taskInput}
            onChange={(e) => setTaskInput(e.target.value)}
            placeholder="Add task..."
            className="flex-1 border p-3 rounded"
          />
          <button
            onClick={addTask}
            className="bg-indigo-500 text-white px-5 rounded"
          >
            <Plus />
          </button>
        </div>

        {/* Progress */}
        {totalCount > 0 && (
          <div className="mb-4">
            <div className="w-full bg-gray-200 h-2 rounded">
              <div
                className="bg-indigo-500 h-2"
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
              className="flex justify-between p-4 bg-white border rounded"
            >
              <div
                onClick={() => toggleTask(task)}
                className="flex gap-3 cursor-pointer"
              >
                <CheckCircle
                  className={
                    task.completed
                      ? "text-green-500"
                      : "text-gray-400"
                  }
                />
                <span
                  className={
                    task.completed ? "line-through text-gray-400" : ""
                  }
                >
                  {task.text}
                </span>
              </div>

              <button onClick={() => deleteTask(task.id)}>
                <Trash2 />
              </button>
            </div>
          ))}
        </div>

        {/* Empty */}
        {tasks[activeTab].length === 0 && (
          <div className="text-center mt-10 text-gray-400">
            <Trophy />
            <p>No tasks</p>
          </div>
        )}
      </div>
    </div>
  );
}