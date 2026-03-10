"use client";

import { Phone, MessageSquare, Heart, Moon, Zap, Smile, BookOpen, ChevronRight, ExternalLink, ShieldAlert } from "lucide-react";
import Image from "next/image";

export default function ResourcesPage() {
  const categories = [
    {
      title: "Anxiety & Stress",
      desc: "Techniques and tools for managing daily stress and anxiety symptoms.",
      icon: Smile,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
    },
    {
      title: "Depression",
      desc: "Understanding depression and finding paths toward recovery and hope.",
      icon: Heart,
      color: "text-rose-400",
      bg: "bg-rose-500/10",
    },
    {
      title: "Sleep Hygiene",
      desc: "Improve your mental well-being through better rest and routines.",
      icon: Moon,
      color: "text-indigo-400",
      bg: "bg-indigo-500/10",
    },
    {
      title: "Relationships",
      desc: "Navigating social connections, boundaries, and communication skills.",
      icon: MessageSquare,
      color: "text-amber-400",
      bg: "bg-amber-500/10",
    },
    {
      title: "Resilience",
      desc: "Building inner strength to bounce back from life’s challenges.",
      icon: Zap,
      color: "text-purple-400",
      bg: "bg-purple-500/10",
    },
    {
      title: "Mindfulness",
      desc: "Practices to stay present and cultivate a peaceful mind every day.",
      icon: BookOpen,
      color: "text-sky-400",
      bg: "bg-sky-500/10",
    },
  ];

  const articles = [
    {
      title: "Finding Stillness: A Beginner's Guide",
      desc: "How five minutes of daily meditation can reshape your neurological response.",
      img: "https://images.unsplash.com/photo-1518245387944-8c08b2a2696d?auto=format&fit=crop&w=400&q=80",
      tag: "Meditation"
    },
    {
      title: "Journaling for Emotional Regulation",
      desc: "The science behind how writing down thoughts lowers cortisol levels.",
      img: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=400&q=80",
      tag: "Exercise"
    },
    {
      title: "Setting Healthy Boundaries",
      desc: "Expert advice on protecting your energy in personal and professional spaces.",
      img: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=400&q=80",
      tag: "Social"
    },
  ];

  return (
    <div className="bg-[#0b1623] text-white min-h-screen pb-20">
      <div className="max-w-6xl mx-auto px-6 py-12">
        
        {/* Page Header */}
        <div className="mb-12 max-w-2xl">
          <h1 className="text-4xl font-extrabold tracking-tight mb-4">Support & Resources</h1>
          <p className="text-gray-400 text-lg leading-relaxed">
            Find the help and professional information you need to support your
            mental well-being. You are not alone on this journey.
          </p>
        </div>

        {/* Emergency Support - High Contrast UX */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[#1a2b4b] to-[#101d35] border border-red-500/30 rounded-3xl p-8 mb-16 shadow-2xl">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <ShieldAlert size={120} />
          </div>
          
          <div className="relative z-10">
            <h2 className="text-2xl font-bold text-red-400 mb-3 flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
              Emergency Support
            </h2>
            <p className="text-gray-300 mb-8 max-w-xl">
              If you or someone you know is in immediate danger or experiencing a
              crisis, these services are confidential, free, and available 24/7.
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <a href="tel:988" className="group flex items-center justify-between bg-red-600 hover:bg-red-500 p-6 rounded-2xl transition-all active:scale-[0.98] shadow-lg">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest opacity-80 mb-1">Crisis Hotline</p>
                  <p className="text-2xl font-black">Call 988</p>
                </div>
                <div className="bg-white/20 p-3 rounded-full group-hover:rotate-12 transition-transform">
                  <Phone size={28} />
                </div>
              </a>

              <a href="sms:741741" className="group flex items-center justify-between bg-[#16243e] border-2 border-red-600/50 hover:border-red-500 p-6 rounded-2xl transition-all active:scale-[0.98]">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Crisis Text Line</p>
                  <p className="text-2xl font-black text-red-400">Text HOME to 741741</p>
                </div>
                <div className="bg-red-500/10 p-3 rounded-full group-hover:scale-110 transition-transform text-red-400">
                  <MessageSquare size={28} />
                </div>
              </a>
            </div>
          </div>
        </section>

        {/* Resource Categories */}
        <section className="mb-20">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-2xl font-bold mb-2">Explore Topics</h2>
              <p className="text-gray-500">Self-guided resources for specific needs</p>
            </div>
            <button className="flex items-center gap-2 text-blue-400 hover:text-blue-300 font-medium transition">
              View All Topics <ChevronRight size={18} />
            </button>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat, i) => {
              const Icon = cat.icon;
              return (
                <div
                  key={i}
                  className="group bg-[#101d35] border border-white/5 p-8 rounded-3xl hover:bg-[#16243e] hover:border-blue-500/50 transition-all duration-300 cursor-pointer"
                >
                  <div className={`${cat.bg} ${cat.color} w-12 h-12 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <Icon size={24} />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{cat.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-6">
                    {cat.desc}
                  </p>
                  <div className="flex items-center gap-2 text-sm font-bold text-blue-400 group-hover:gap-3 transition-all">
                    Explore Resources <ChevronRight size={16} />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Recommended Reading - Visual Refresh */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <h2 className="text-2xl font-bold">Recommended Reading</h2>
            <div className="h-px flex-1 bg-white/5" />
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {articles.map((article, i) => (
              <div
                key={i}
                className="group flex flex-col bg-[#101d35] rounded-3xl overflow-hidden border border-white/5 hover:border-white/10 transition-all"
              >
                <div className="relative h-48 w-full">
                  <Image
                    src={article.img}
                    alt={article.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold">
                    {article.tag}
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-lg font-bold mb-2 group-hover:text-blue-400 transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-gray-400 text-sm mb-6 line-clamp-2">
                    {article.desc}
                  </p>
                  <button className="flex items-center gap-2 text-xs font-black uppercase tracking-widest hover:text-blue-400 transition-colors">
                    Read Article <ExternalLink size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <button className="bg-white/5 hover:bg-white/10 border border-white/10 px-8 py-3 rounded-2xl font-bold transition-all active:scale-95">
              Browse Full Library
            </button>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-24 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-gray-500 text-sm">
          <p>© 2026 MindWell Wellness Inc.</p>
          <div className="flex gap-8">
            <span className="hover:text-white cursor-pointer transition">Privacy Policy</span>
            <span className="hover:text-white cursor-pointer transition">Terms of Service</span>
            <span className="hover:text-white cursor-pointer transition">Help Center</span>
          </div>
        </footer>
      </div>
    </div>
  );
}