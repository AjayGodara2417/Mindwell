"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  MapPin,
  Calendar,
  TrendingUp,
  CheckCircle2,
  Video,
  Award,
} from "lucide-react";

export default function ProfilePage() {

  type User = {
    full_name?: string;
    email?: string;
    // Add other fields as needed
  };

  type Assessment = {
    score: number;
    severity: string;
    percentage: number;
    created_at: string;
    // Add other fields as needed
  };

  const [user, setUser] = useState<User | null>(null);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const fetchData = async () => {

      try {

        const token = localStorage.getItem("token");

        /* -------- Fetch User Profile -------- */

        const profileRes = await fetch("/api/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const profileData = await profileRes.json();

        setUser(profileData);

        /* -------- Fetch Assessment History -------- */

        const res = await fetch(
          `/api/assessment?email=${profileData.email}`
        );

        const assessmentData = await res.json();

        if (assessmentData.success) {
          setAssessments(assessmentData.history);
        }

      } catch (error) {
        console.error("Profile load error:", error);
      }

      setLoading(false);
    };

    fetchData();

  }, []);

  /* -------- Loading State -------- */

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh] text-gray-500">
        Loading profile...
      </div>
    );
  }

  /* -------- Dashboard Stats -------- */

  const stats = [
    {
      label: "Mood Checks",
      value: assessments.length,
      icon: Video,
    },
    {
      label: "Tasks Done",
      value: 42,
      icon: CheckCircle2,
    },
    {
      label: "Streak",
      value: "7 Days",
      icon: Award,
    },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8">

      {/* -------- Profile Header -------- */}

      <div className="flex items-center gap-6 bg-white p-6 rounded-xl shadow">

        <div className="w-20 h-20 relative rounded-full overflow-hidden bg-gray-200">
          <Image
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"
            alt="avatar"
            fill
            className="object-cover"
          />
        </div>

        <div>
          <h1 className="text-xl font-bold text-gray-900">
            {user?.full_name || "User"}
          </h1>

          <p className="text-sm text-gray-500">{user?.email}</p>

          <div className="flex gap-4 text-sm text-gray-500 mt-1">

            <span className="flex items-center gap-1">
              <MapPin size={14} /> India
            </span>

            <span className="flex items-center gap-1">
              <Calendar size={14} /> Member
            </span>

          </div>
        </div>

      </div>

      {/* -------- About Section -------- */}

      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="font-semibold mb-2">About</h2>
        <p className="text-gray-600">
          Track your mental wellness journey with MindWell. 
          Monitor stress levels, record emotions through Face Diary,
          and improve your daily habits.
        </p>
      </div>

      {/* -------- Stats -------- */}

      <div className="grid md:grid-cols-3 gap-6">

        {stats.map((stat, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-xl shadow flex items-center gap-4"
          >

            <stat.icon className="text-blue-600" />

            <div>
              <p className="text-xl font-bold">{stat.value}</p>
              <p className="text-sm text-gray-500">{stat.label}</p>
            </div>

          </div>
        ))}

      </div>

      {/* -------- Mental Health Chart -------- */}

      <div className="bg-white p-6 rounded-xl shadow">

        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="text-blue-600" />
          <h2 className="font-semibold">Mental Health Trend</h2>
        </div>

        {assessments.length === 0 ? (

          <p className="text-gray-500 text-sm">
            No assessment data available.
          </p>

        ) : (

          <div className="flex items-end h-40 gap-4">

            {assessments.map((item, i) => {

              const barColor =
                item.severity === "Very Severe"
                  ? "bg-red-500"
                  : item.severity === "Severe"
                  ? "bg-orange-500"
                  : item.severity === "Moderate"
                  ? "bg-yellow-500"
                  : item.severity === "Mild"
                  ? "bg-blue-500"
                  : "bg-green-500";

              return (

                <div
                  key={i}
                  className="flex flex-col items-center flex-1"
                >

                  {/* Score Label */}

                  <p className="text-xs font-semibold text-gray-700">
                    {item.score}
                  </p>

                  {/* Bar */}

                  <div
                    className={`w-full rounded ${barColor}`}
                    style={{
                      height: `${item.percentage}%`,
                    }}
                  />

                  {/* Date */}

                  <span className="text-xs text-gray-500 mt-1">
                    {new Date(item.created_at).toLocaleDateString(
                      "en-US",
                      {
                        month: "short",
                        day: "numeric",
                      }
                    )}
                  </span>

                </div>

              );
            })}

          </div>

        )}

      </div>

      {/* -------- Severity Legend -------- */}

      <div className="bg-white p-4 rounded-xl shadow text-sm flex gap-6">

        <span className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded"></div> Minimal
        </span>

        <span className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-500 rounded"></div> Mild
        </span>

        <span className="flex items-center gap-2">
          <div className="w-3 h-3 bg-yellow-500 rounded"></div> Moderate
        </span>

        <span className="flex items-center gap-2">
          <div className="w-3 h-3 bg-orange-500 rounded"></div> Severe
        </span>

        <span className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded"></div> Very Severe
        </span>

      </div>

    </div>
  );
}