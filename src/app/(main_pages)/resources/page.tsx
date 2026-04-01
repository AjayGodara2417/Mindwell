"use client";

import {
  Phone,
  MessageSquare,
  Heart,
  Moon,
  Zap,
  Smile,
  BookOpen,
  ChevronRight,
  ShieldAlert,
  ArrowRight
} from "lucide-react";

export default function ResourcesPage() {
  const categories = [
    { title: "Anxiety & Stress", desc: "Tools and techniques to manage daily stress.", icon: Smile, color: "text-emerald-600", bg: "bg-emerald-50" },
    { title: "Depression", desc: "Understanding symptoms and pathways to recovery.", icon: Heart, color: "text-rose-600", bg: "bg-rose-50" },
    { title: "Sleep Hygiene", desc: "Improve mental health through better rest.", icon: Moon, color: "text-indigo-600", bg: "bg-indigo-50" },
    { title: "Relationships", desc: "Communication skills and healthy boundaries.", icon: MessageSquare, color: "text-blue-600", bg: "bg-blue-50" },
    { title: "Resilience", desc: "Build inner strength to face life challenges.", icon: Zap, color: "text-amber-600", bg: "bg-amber-50" },
    { title: "Mindfulness", desc: "Stay present and cultivate inner calmness.", icon: BookOpen, color: "text-teal-600", bg: "bg-teal-50" },
  ];

  return (
    <div className="bg-slate-50 min-h-screen p-6 md:p-8 animate-in fade-in duration-500">
      <div className="max-w-6xl mx-auto space-y-10">

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Support & Resources</h1>
          <p className="text-slate-500 mt-2 text-lg">Helpful tools, articles, and guidance for your wellbeing.</p>
        </div>

        {/* Emergency Section */}
        <section className="bg-white rounded-2xl p-1 shadow-sm border border-red-100 overflow-hidden">
          <div className="bg-red-50 p-6 md:p-8 rounded-xl">
            <div className="flex items-start gap-4 mb-6">
              <div className="p-3 bg-red-100 rounded-xl text-red-600">
                <ShieldAlert size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-red-900">Emergency Support</h2>
                <p className="text-red-700/80 text-sm mt-1">If you are in immediate distress or danger, please reach out for help immediately.</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <a href="tel:988" className="group bg-red-600 hover:bg-red-700 text-white px-6 py-4 rounded-xl flex justify-between items-center transition-all shadow-lg shadow-red-500/20">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <Phone size={20} />
                  </div>
                  <span className="font-bold">Call 988</span>
                </div>
                <ArrowRight size={20} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
              </a>

              <a href="sms:741741" className="group bg-white hover:bg-red-50 text-red-700 border border-red-200 px-6 py-4 rounded-xl flex justify-between items-center transition-all">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <MessageSquare size={20} />
                  </div>
                  <span className="font-bold">Text HOME to 741741</span>
                </div>
                <ArrowRight size={20} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
              </a>
            </div>
          </div>
        </section>

        {/* Categories Grid */}
        <section>
          <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <BookOpen size={20} className="text-teal-600" />
            Explore Topics
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat, i) => {
              const Icon = cat.icon;
              return (
                <div
                  key={i}
                  className="group bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-lg hover:border-teal-100 transition-all duration-300 cursor-pointer flex flex-col h-full"
                >
                  <div className={`w-12 h-12 ${cat.bg} rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon size={24} className={cat.color} />
                  </div>

                  <h3 className="font-bold text-slate-800 text-lg mb-2 group-hover:text-teal-700 transition-colors">
                    {cat.title}
                  </h3>

                  <p className="text-sm text-slate-500 mb-6 leading-relaxed flex-1">
                    {cat.desc}
                  </p>

                  <div className="flex items-center gap-2 text-sm font-semibold text-teal-600 group-hover:gap-3 transition-all">
                    Read Articles <ChevronRight size={16} />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

      </div>
    </div>
  );
}