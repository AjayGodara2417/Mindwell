"use client"

import { useRouter } from "next/navigation"
import { User, Bell, Shield, Lock, LogOut, ChevronRight } from "lucide-react"
import { useState, useCallback } from "react"

// Define Types for better safety
interface NotificationSettings {
  mood: boolean;
  sleep: boolean;
  report: boolean;
}

interface ToggleItemProps {
  title: string;
  desc: string;
  enabled: boolean;
  onToggle: () => void;
}

export default function Settings() {
  const router = useRouter()

  const profile = {
    full_name: "John Doe",
    email: "user@example.com"
  }

  const [notifications, setNotifications] = useState<NotificationSettings>({
    mood: true,
    sleep: true,
    report: false
  })

  // Use useCallback for performance and to prevent unnecessary re-renders
  const toggle = useCallback((key: keyof NotificationSettings) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }, [])

  const handleSignOut = () => {
    // In a real app, you would clear cookies/tokens here
    router.push("/login")
  }

  return (
    <div className="min-h-screen bg-[#0b1623] text-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        
        {/* Header */}
        <header className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-2">Settings</h1>
          <p className="text-gray-400 text-lg">
            Manage your account, notifications and security preferences.
          </p>
        </header>

        <div className="space-y-10 pb-20">
          
          {/* ACCOUNT SECTION */}
          <section className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:border-white/20 transition-colors">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <User className="text-blue-400 w-5 h-5"/>
              </div>
              <h2 className="text-xl font-semibold">Account</h2>
            </div>

            <div className="divide-y divide-white/5">
              <div className="flex justify-between items-center py-4">
                <div>
                  <p className="text-white font-medium text-lg">Full Name</p>
                  <p className="text-gray-400">{profile.full_name}</p>
                </div>
                <button className="px-4 py-2 text-sm bg-white/10 rounded-lg hover:bg-white/20 transition-all active:scale-95">
                  Edit
                </button>
              </div>

              <div className="flex justify-between items-center py-4">
                <div>
                  <p className="text-white font-medium text-lg">Email Address</p>
                  <p className="text-gray-400">{profile.email}</p>
                </div>
                <button className="px-4 py-2 text-sm bg-white/10 rounded-lg hover:bg-white/20 transition-all active:scale-95">
                  Change
                </button>
              </div>
            </div>
          </section>

          {/* NOTIFICATIONS SECTION */}
          <section className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:border-white/20 transition-colors">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Bell className="text-purple-400 w-5 h-5"/>
              </div>
              <h2 className="text-xl font-semibold">Notifications</h2>
            </div>

            <div className="space-y-8">
              <ToggleItem
                title="Daily Mood Check-in"
                desc="Get reminded to record your daily mood."
                enabled={notifications.mood}
                onToggle={() => toggle("mood")}
              />
              <ToggleItem
                title="Sleep Reminder"
                desc="Receive reminders to maintain healthy sleep habits."
                enabled={notifications.sleep}
                onToggle={() => toggle("sleep")}
              />
              <ToggleItem
                title="Weekly Report"
                desc="Get weekly emotional analysis reports."
                enabled={notifications.report}
                onToggle={() => toggle("report")}
              />
            </div>
          </section>

          {/* SECURITY SECTION */}
          <section className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:border-white/20 transition-colors">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <Shield className="text-green-400 w-5 h-5"/>
              </div>
              <h2 className="text-xl font-semibold">Security</h2>
            </div>

            <button className="w-full flex justify-between items-center p-5 rounded-xl bg-white/5 hover:bg-white/10 transition-all group border border-transparent hover:border-white/10">
              <div className="flex items-center gap-4 text-left">
                <div className="p-2 bg-white/5 rounded-full">
                   <Lock className="text-gray-400 w-5 h-5" />
                </div>
                <div>
                  <p className="text-white font-medium">Change Password</p>
                  <p className="text-gray-400 text-sm">Update your account password for better security</p>
                </div>
              </div>
              <ChevronRight className="text-gray-600 group-hover:text-white transition-colors" />
            </button>
          </section>

          {/* SIGN OUT SECTION */}
          <section className="pt-4">
            <button
              onClick={handleSignOut}
              className="w-full p-5 rounded-2xl border border-red-500/40 text-red-400 hover:bg-red-500/10 transition-all flex items-center justify-center gap-3 text-lg font-semibold active:scale-[0.99]"
            >
              <LogOut className="w-5 h-5"/>
              Sign Out
            </button>
          </section>
        </div>
      </div>
    </div>
  )
}

/* ---------------- TOGGLE COMPONENT ---------------- */

function ToggleItem({ title, desc, enabled, onToggle }: ToggleItemProps) {
  return (
    <div className="flex items-center justify-between group">
      <div className="pr-4">
        <p className="text-white font-medium text-lg group-hover:text-blue-400 transition-colors">
          {title}
        </p>
        <p className="text-gray-400 text-sm">
          {desc}
        </p>
      </div>

      <button
        onClick={onToggle}
        aria-pressed={enabled}
        className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-[#0b1623] ${
          enabled ? "bg-blue-500" : "bg-gray-700"
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
            enabled ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  )
}