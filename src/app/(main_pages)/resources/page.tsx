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
} from "lucide-react";

export default function ResourcesPage() {

  const categories = [
    {
      title: "Anxiety & Stress",
      desc: "Tools and techniques to manage stress and anxiety.",
      icon: Smile,
      color: "text-emerald-600",
      bg: "bg-emerald-100",
    },
    {
      title: "Depression",
      desc: "Learn about depression and pathways to recovery.",
      icon: Heart,
      color: "text-rose-600",
      bg: "bg-rose-100",
    },
    {
      title: "Sleep Hygiene",
      desc: "Improve mental health through better sleep.",
      icon: Moon,
      color: "text-indigo-600",
      bg: "bg-indigo-100",
    },
    {
      title: "Relationships",
      desc: "Communication and healthy boundaries.",
      icon: MessageSquare,
      color: "text-amber-600",
      bg: "bg-amber-100",
    },
    {
      title: "Resilience",
      desc: "Build strength to face life challenges.",
      icon: Zap,
      color: "text-purple-600",
      bg: "bg-purple-100",
    },
    {
      title: "Mindfulness",
      desc: "Stay present and cultivate calmness.",
      icon: BookOpen,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
  ];

  return (
    <div className="max-w-6xl px-5 py-15 mx-auto space-y-12">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Support & Resources
        </h1>
        <p className="text-gray-500">
          Helpful tools and professional resources for your mental wellbeing.
        </p>
      </div>

      {/* Emergency Section */}
      <section className="bg-red-50 border border-red-200 rounded-xl p-8">
        <div className="flex items-center gap-3 mb-4 text-red-600 font-semibold">
          <ShieldAlert />
          Emergency Support
        </div>

        <p className="text-gray-600 mb-6">
          If you are experiencing a crisis, please contact these services.
        </p>

        <div className="grid md:grid-cols-2 gap-4">
          <a
            href="tel:988"
            className="bg-red-600 text-white p-5 rounded-lg flex justify-between items-center hover:bg-red-500 transition"
          >
            Call 988
            <Phone />
          </a>

          <a
            href="sms:741741"
            className="border border-red-300 p-5 rounded-lg flex justify-between items-center hover:bg-red-50 transition"
          >
            Text HOME to 741741
            <MessageSquare className="text-red-600" />
          </a>
        </div>
      </section>

      {/* Categories */}
      <section>
        <h2 className="text-xl font-semibold mb-6 text-gray-800">
          Explore Topics
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {categories.map((cat, i) => {
            const Icon = cat.icon;

            return (
              <div
                key={i}
                className="group relative bg-white border border-gray-200 rounded-2xl p-6 
        hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
              >
                {/* Glow Effect */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition duration-300 bg-linear-to-br from-blue-50 to-transparent pointer-events-none" />

                {/* Icon */}
                <div
                  className={`${cat.bg} ${cat.color} w-12 h-12 rounded-xl flex items-center justify-center mb-5 
          group-hover:scale-110 transition`}
                >
                  <Icon size={22} />
                </div>

                {/* Title */}
                <h3 className="font-semibold text-lg text-gray-900 mb-2 group-hover:text-blue-600 transition">
                  {cat.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-gray-500 mb-5 leading-relaxed">
                  {cat.desc}
                </p>

                {/* CTA */}
                <div className="flex items-center justify-between">
                  <span className="text-blue-600 text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                    Explore <ChevronRight size={16} />
                  </span>

                  {/* Subtle Arrow Circle */}
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center 
          group-hover:bg-blue-600 transition">
                    <ChevronRight
                      size={16}
                      className="text-gray-500 group-hover:text-white transition"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}