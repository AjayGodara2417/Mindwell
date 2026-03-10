"use client"

import { useRouter } from "next/navigation"
import { User, Bell, Shield, Lock, LogOut } from "lucide-react"
import { useState } from "react"

export default function Settings() {

  const router = useRouter()

  const profile = {
    full_name: "John Doe",
    email: "user@example.com"
  }

  const [notifications, setNotifications] = useState({
    mood: true,
    sleep: true,
    report: false
  })

  const toggle = (key: string) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  const handleSignOut = () => {
    router.push("/login")
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">

      {/* Header */}

      <header className="mb-12">

        <h1 className="text-4xl font-bold text-white mb-2">
          Settings
        </h1>

        <p className="text-gray-400 text-lg">
          Manage your account, notifications and security preferences.
        </p>

      </header>


      <div className="space-y-10">

        {/* ACCOUNT */}

        <section className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:border-white/20 transition">

          <div className="flex items-center gap-3 mb-6">

            <div className="p-2 bg-blue-500/20 rounded-lg">
              <User className="text-blue-400 w-5 h-5"/>
            </div>

            <h2 className="text-xl font-semibold text-white">
              Account
            </h2>

          </div>

          <div className="space-y-6">

            <div className="flex justify-between items-center">

              <div>
                <p className="text-white font-medium text-lg">
                  Full Name
                </p>
                <p className="text-gray-400">
                  {profile.full_name}
                </p>
              </div>

              <button className="px-4 py-2 text-sm bg-white/10 rounded-lg hover:bg-white/20 transition">
                Edit
              </button>

            </div>

            <div className="flex justify-between items-center">

              <div>
                <p className="text-white font-medium text-lg">
                  Email Address
                </p>
                <p className="text-gray-400">
                  {profile.email}
                </p>
              </div>

            </div>

          </div>

        </section>


        {/* NOTIFICATIONS */}

        <section className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:border-white/20 transition">

          <div className="flex items-center gap-3 mb-6">

            <div className="p-2 bg-purple-500/20 rounded-lg">
              <Bell className="text-purple-400 w-5 h-5"/>
            </div>

            <h2 className="text-xl font-semibold text-white">
              Notifications
            </h2>

          </div>

          <div className="space-y-6">

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


        {/* SECURITY */}

        <section className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:border-white/20 transition">

          <div className="flex items-center gap-3 mb-6">

            <div className="p-2 bg-green-500/20 rounded-lg">
              <Shield className="text-green-400 w-5 h-5"/>
            </div>

            <h2 className="text-xl font-semibold text-white">
              Security
            </h2>

          </div>

          <button className="w-full flex justify-between items-center p-4 rounded-xl bg-white/5 hover:bg-white/10 transition">

            <div>
              <p className="text-white font-medium">
                Change Password
              </p>
              <p className="text-gray-400 text-sm">
                Update your account password for better security
              </p>
            </div>

            <Lock className="text-gray-400"/>

          </button>

        </section>


        {/* SIGN OUT */}

        <section className="pt-4">

          <button
            onClick={handleSignOut}
            className="w-full p-4 rounded-xl border border-red-500/40 text-red-400 hover:bg-red-500/10 transition flex items-center justify-center gap-2 text-lg"
          >

            <LogOut className="w-5 h-5"/>

            Sign Out

          </button>

        </section>

      </div>

    </div>
  )
}



/* ---------------- TOGGLE COMPONENT ---------------- */

function ToggleItem({
  title,
  desc,
  enabled,
  onToggle
}: any) {

  return (

    <div className="flex items-center justify-between">

      <div>

        <p className="text-white font-medium">
          {title}
        </p>

        <p className="text-gray-400 text-sm">
          {desc}
        </p>

      </div>

      <button
        onClick={onToggle}
        className={`w-12 h-7 rounded-full transition flex items-center px-1
        ${enabled ? "bg-blue-500 justify-end" : "bg-gray-600 justify-start"}
        `}
      >
        <div className="w-5 h-5 bg-white rounded-full"/>
      </button>

    </div>

  )

}