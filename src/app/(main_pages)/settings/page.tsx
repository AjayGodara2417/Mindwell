"use client"

import { useRouter } from "next/navigation"
import { User, Bell, Shield, Lock, LogOut, ChevronRight } from "lucide-react"
import { useState, useCallback } from "react"

interface NotificationSettings {
  mood: boolean
  sleep: boolean
  report: boolean
}

interface ToggleItemProps {
  title: string
  desc: string
  enabled: boolean
  onToggle: () => void
}

export default function Settings() {
  const router = useRouter()

  const profile = {
    full_name: "John Doe",
    email: "user@example.com",
  }

  const [notifications, setNotifications] = useState<NotificationSettings>({
    mood: true,
    sleep: true,
    report: false,
  })

  const toggle = useCallback((key: keyof NotificationSettings) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }, [])

  const handleSignOut = () => {
    router.push("/login")
  }

  return (
  <div className="max-w-6xl mx-auto flex flex-col gap-10">

    {/* Header */}
    <div>
      <h1 className="text-3xl font-bold text-white">Settings</h1>
      <p className="text-gray-400 mt-1">
        Manage your account and preferences
      </p>
    </div>


    {/* FIRST ROW */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

      {/* ACCOUNT */}
      <section className="bg-white/5 border border-white/10 rounded-xl p-8 min-h-55">
        <div className="flex items-center gap-3 mb-6">
          <User className="text-blue-400"/>
          <h2 className="text-lg font-semibold">Account</h2>
        </div>

        <div className="space-y-8">

          <div className="flex justify-between items-center">
            <div>
              <p className="text-white font-medium">Full Name</p>
              <p className="text-gray-400 text-sm">{profile.full_name}</p>
            </div>

            <button className="px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 text-sm">
              Edit
            </button>
          </div>

          <div className="flex justify-between items-center">
            <div>
              <p className="text-white font-medium">Email</p>
              <p className="text-gray-400 text-sm">{profile.email}</p>
            </div>

            <button className="px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 text-sm">
              Change
            </button>
          </div>

        </div>
      </section>


      {/* NOTIFICATIONS */}
      <section className="bg-white/5 border border-white/10 rounded-xl p-8 min-h-55">

        <div className="flex items-center gap-3 mb-6">
          <Bell className="text-purple-400"/>
          <h2 className="text-lg font-semibold">Notifications</h2>
        </div>

        <div className="space-y-8">

          <ToggleItem
            title="Daily Mood Check-in"
            desc="Get reminded to record your mood."
            enabled={notifications.mood}
            onToggle={() => toggle("mood")}
          />

          <ToggleItem
            title="Sleep Reminder"
            desc="Receive sleep improvement reminders."
            enabled={notifications.sleep}
            onToggle={() => toggle("sleep")}
          />

          <ToggleItem
            title="Weekly Report"
            desc="Receive emotional analysis reports."
            enabled={notifications.report}
            onToggle={() => toggle("report")}
          />

        </div>
      </section>

    </div>



    {/* SECOND ROW */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">

      {/* SECURITY */}
      <section className="bg-white/5 border border-white/10 rounded-xl p-8 flex flex-col justify-between min-h-45">

        <div>
          <div className="flex items-center gap-3 mb-6">
            <Shield className="text-green-400"/>
            <h2 className="text-lg font-semibold">Security</h2>
          </div>

          <button className="w-full flex justify-between items-center bg-white/5 hover:bg-white/10 p-4 rounded-lg transition">
            <div className="flex items-center gap-4">
              <Lock className="text-gray-400"/>
              <span>Change Password</span>
            </div>

            <ChevronRight className="text-gray-500"/>
          </button>
        </div>

      </section>


      {/* SIGN OUT */}
      <section className="flex items-end justify-end min-h-45">

        <button
          onClick={handleSignOut}
          className="border border-red-500/40 text-red-400 px-8 py-3 rounded-xl hover:bg-red-500/10 flex items-center gap-2"
        >
          <LogOut size={18}/>
          Sign Out
        </button>

      </section>

    </div>

  </div>
)
}

function ToggleItem({ title, desc, enabled, onToggle }: ToggleItemProps) {
  return (
    <div className="flex justify-between items-center">
      <div>
        <p className="text-white font-medium">{title}</p>
        <p className="text-gray-400 text-sm">{desc}</p>
      </div>

      <button
        onClick={onToggle}
        className={`w-11 h-6 rounded-full transition ${
          enabled ? "bg-blue-500" : "bg-gray-600"
        }`}
      >
        <div
          className={`h-5 w-5 bg-white rounded-full transition transform ${
            enabled ? "translate-x-5" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  )
}