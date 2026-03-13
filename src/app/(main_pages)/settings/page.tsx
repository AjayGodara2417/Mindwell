"use client";

import { useState } from "react";
import { User, Bell, Shield, Lock, LogOut } from "lucide-react";

export default function Settings() {

  const [notifications, setNotifications] = useState({
    mood: true,
    sleep: true,
    report: false,
  });

  const toggle = (key: string) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">

      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500">
          Manage your account preferences
        </p>
      </div>

      {/* Account */}
      <div className="bg-white p-6 rounded-xl shadow-sm space-y-6">

        <div className="flex items-center gap-2 font-semibold">
          <User size={18} /> Account
        </div>

        <div className="flex justify-between">
          <div>
            <p className="font-medium">Full Name</p>
            <p className="text-gray-500 text-sm">John Doe</p>
          </div>

          <button className="text-blue-600 text-sm">Edit</button>
        </div>

        <div className="flex justify-between">
          <div>
            <p className="font-medium">Email</p>
            <p className="text-gray-500 text-sm">user@example.com</p>
          </div>

          <button className="text-blue-600 text-sm">Change</button>
        </div>

      </div>

      {/* Notifications */}
      <div className="bg-white p-6 rounded-xl shadow-sm space-y-6">

        <div className="flex items-center gap-2 font-semibold">
          <Bell size={18} /> Notifications
        </div>

        <Toggle
          title="Daily Mood Reminder"
          enabled={notifications.mood}
          onToggle={() => toggle("mood")}
        />

        <Toggle
          title="Sleep Reminder"
          enabled={notifications.sleep}
          onToggle={() => toggle("sleep")}
        />

        <Toggle
          title="Weekly Report"
          enabled={notifications.report}
          onToggle={() => toggle("report")}
        />

      </div>

      {/* Security */}
      <div className="bg-white p-6 rounded-xl shadow-sm">

        <div className="flex items-center gap-2 font-semibold mb-4">
          <Shield size={18} /> Security
        </div>

        <button className="flex items-center gap-2 text-blue-600">
          <Lock size={16} />
          Change Password
        </button>

      </div>

      {/* Sign Out */}
      <button className="border border-red-300 text-red-600 px-5 py-2 rounded-lg hover:bg-red-50 flex items-center gap-2">
        <LogOut size={16} />
        Sign Out
      </button>

    </div>
  );
}

function Toggle({ title, enabled, onToggle }: any) {
  return (
    <div className="flex justify-between items-center">
      <p>{title}</p>

      <button
        onClick={onToggle}
        className={`w-10 h-5 rounded-full ${
          enabled ? "bg-blue-600" : "bg-gray-300"
        } relative`}
      >
        <div
          className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition ${
            enabled ? "right-0.5" : "left-0.5"
          }`}
        />
      </button>
    </div>
  );
}