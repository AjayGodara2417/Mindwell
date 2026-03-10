"use client";
import { useState } from "react";
import { Calendar, Plus, CheckCircle, Trash2 } from "lucide-react";

export default function PlannerPage() {
  const [tasks, setTasks] = useState({
    daily: [],
    weekly: [],
    monthly: [],
  });

  const [activeTab, setActiveTab] = useState("daily");
  const [taskInput, setTaskInput] = useState("");

  const addTask = () => {
    if (!taskInput.trim()) return;

    const newTask = {
      text: taskInput,
      completed: false,
    };

    setTasks((prev) => ({
      ...prev,
      [activeTab]: [...prev[activeTab], newTask],
    }));

    setTaskInput("");
  };

  const toggleTask = (index) => {
    const updated = [...tasks[activeTab]];
    updated[index].completed = !updated[index].completed;

    setTasks((prev) => ({
      ...prev,
      [activeTab]: updated,
    }));
  };

  const deleteTask = (index) => {
    const updated = tasks[activeTab].filter((_, i) => i !== index);

    setTasks((prev) => ({
      ...prev,
      [activeTab]: updated,
    }));
  };

  return (
    <div className="min-h-full min-w-full bg-[#0b1730] text-white p-10">
      
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <Calendar className="text-purple-400" />
        <h1 className="text-3xl font-bold">Planner</h1>
      </div>

      <p className="text-gray-400 mb-8">
        Organize your tasks to stay stress-free.
      </p>

      {/* Tabs */}
      <div className="flex bg-[#16243e] rounded-xl p-1 w-fit mb-6">
        {["daily", "weekly", "monthly"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2 rounded-lg capitalize transition ${
              activeTab === tab
                ? "bg-purple-500"
                : "text-gray-400 hover:text-white"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="flex items-center gap-4 bg-[#16243e] p-4 rounded-xl border border-gray-700">
        <input
          value={taskInput}
          onChange={(e) => setTaskInput(e.target.value)}
          placeholder={`Add a ${activeTab} task...`}
          className="flex-1 bg-transparent outline-none text-gray-300"
        />

        <button
          onClick={addTask}
          className="flex items-center gap-2 bg-purple-500 px-5 py-2 rounded-lg hover:bg-purple-600 transition"
        >
          <Plus size={18} />
          Add
        </button>
      </div>

      {/* Task List */}
      <div className="mt-8 space-y-4">
        {tasks[activeTab].map((task, index) => (
          <div
            key={index}
            className="flex items-center justify-between bg-[#16243e] border border-gray-700 p-4 rounded-xl"
          >
            <div
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => toggleTask(index)}
            >
              <CheckCircle
                className={`${
                  task.completed ? "text-green-500" : "text-gray-500"
                }`}
              />

              <span
                className={`${
                  task.completed
                    ? "line-through text-gray-500"
                    : "text-gray-200"
                }`}
              >
                {task.text}
              </span>
            </div>

            <Trash2
              className="text-gray-500 hover:text-red-500 cursor-pointer"
              onClick={() => deleteTask(index)}
            />
          </div>
        ))}
      </div>

      {tasks[activeTab].length === 0 && (
        <p className="text-center text-gray-500 mt-10">
          No tasks yet. Start planning!
        </p>
      )}
    </div>
  );
}