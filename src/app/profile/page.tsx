"use client";

import { useState } from "react";
import { 
  User, 
  MapPin, 
  Calendar, 
  TrendingUp, 
  CheckCircle2, 
  Video, 
  Edit3,
  Award,
  ArrowUpRight
} from "lucide-react";
import Image from "next/image";

export default function ProfilePage() {
  // Mock data - in a real app, this comes from your database
  const user = {
    name: "John Doe",
    email: "john.doe@example.com",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80",
    joinDate: "Member since Jan 2024",
    location: "New York, USA",
    bio: "Focusing on mindfulness and consistent productivity. Recovering coffee addict.",
  };

  const stats = [
    { label: "Mood Checks", value: "24", icon: Video, color: "text-blue-400" },
    { label: "Tasks Done", value: "142", icon: CheckCircle2, color: "text-green-400" },
    { label: "Streak", value: "12 Days", icon: Award, color: "text-purple-400" },
  ];

  const recentMoods = [
    { day: "Mon", score: 8, level: "Minimal" },
    { day: "Tue", score: 15, level: "Mild" },
    { day: "Wed", score: 5, level: "Minimal" },
    { day: "Thu", score: 12, level: "Mild" },
    { day: "Fri", score: 7, level: "Minimal" },
  ];

  return (
    <div className="min-h-screen bg-[#0b1623] text-white pb-20">
      {/* Cover Backdrop */}
      <div className="h-48 w-full bg-gradient-to-r from-blue-900 to-purple-900 opacity-50" />

      <div className="max-w-5xl mx-auto px-6">
        <div className="relative -mt-16 flex flex-col md:flex-row items-start md:items-end gap-6 mb-12">
          {/* Avatar */}
          <div className="relative h-32 w-32 rounded-3xl overflow-hidden border-4 border-[#0b1623] shadow-2xl">
            <Image 
              src={user.avatar} 
              alt="Profile" 
              fill 
              className="object-cover"
            />
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold">{user.name}</h1>
              <button className="p-1.5 bg-white/5 rounded-full hover:bg-white/10 transition">
                <Edit3 size={16} className="text-gray-400" />
              </button>
            </div>
            <div className="flex flex-wrap gap-4 mt-2 text-gray-400 text-sm">
              <span className="flex items-center gap-1"><MapPin size={14}/> {user.location}</span>
              <span className="flex items-center gap-1"><Calendar size={14}/> {user.joinDate}</span>
            </div>
          </div>

          <button className="bg-blue-600 hover:bg-blue-500 px-6 py-2.5 rounded-xl font-bold transition shadow-lg shadow-blue-900/20 active:scale-95">
            Share Profile
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Bio & Stats */}
          <div className="lg:col-span-1 space-y-8">
            <section className="bg-white/5 border border-white/10 rounded-3xl p-6">
              <h2 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-4">About Me</h2>
              <p className="text-gray-300 leading-relaxed">
                {user.bio}
              </p>
            </section>

            <div className="grid grid-cols-1 gap-4">
              {stats.map((stat, i) => (
                <div key={i} className="bg-[#101d35] border border-white/5 p-5 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl bg-white/5 ${stat.color}`}>
                      <stat.icon size={20} />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{stat.value}</p>
                      <p className="text-xs text-gray-500 uppercase font-bold">{stat.label}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Mood Charts & Activity */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Mood Trend Visualization */}
            <section className="bg-white/5 border border-white/10 rounded-3xl p-8">
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
                    <TrendingUp size={20} />
                  </div>
                  <h2 className="text-xl font-bold">Mental Health Trend</h2>
                </div>
                <select className="bg-white/5 border border-white/10 rounded-lg text-xs p-2 outline-none">
                  <option>Last 7 Days</option>
                  <option>Last 30 Days</option>
                </select>
              </div>

              <div className="flex items-end justify-between h-40 gap-2">
                {recentMoods.map((m, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-3 group">
                    <div 
                      className={`w-full rounded-t-lg transition-all duration-500 ${m.score > 10 ? 'bg-blue-500/40' : 'bg-blue-500'}`}
                      style={{ height: `${(m.score / 20) * 100}%` }}
                    />
                    <span className="text-xs font-bold text-gray-500 group-hover:text-white transition-colors">{m.day}</span>
                  </div>
                ))}
              </div>
              
            </section>

            {/* Recent Activity Log */}
            <section className="bg-white/5 border border-white/10 rounded-3xl p-8">
              <h2 className="text-xl font-bold mb-6">Recent Activity</h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="mt-1 p-2 bg-green-500/20 rounded-full h-fit">
                    <CheckCircle2 size={16} className="text-green-400" />
                  </div>
                  <div className="flex-1 border-b border-white/5 pb-4">
                    <p className="text-gray-200">Completed <span className="text-white font-bold">"Daily Meditation"</span> in Weekly Planner</p>
                    <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
                  </div>
                  <ArrowUpRight size={16} className="text-gray-600" />
                </div>

                <div className="flex gap-4">
                  <div className="mt-1 p-2 bg-blue-500/20 rounded-full h-fit">
                    <Video size={16} className="text-blue-400" />
                  </div>
                  <div className="flex-1 border-b border-white/5 pb-4">
                    <p className="text-gray-200">Recorded a <span className="text-white font-bold">Face Diary</span> entry</p>
                    <p className="text-xs text-gray-500 mt-1">Yesterday, 11:30 PM</p>
                  </div>
                  <ArrowUpRight size={16} className="text-gray-600" />
                </div>
              </div>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
}