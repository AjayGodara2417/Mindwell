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
    <div className="max-w-6xl mx-auto space-y-12">

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
                className="bg-white border rounded-xl p-6 hover:shadow-md transition"
              >
                <div
                  className={`${cat.bg} ${cat.color} w-10 h-10 rounded-lg flex items-center justify-center mb-4`}
                >
                  <Icon size={20} />
                </div>

                <h3 className="font-semibold text-gray-900 mb-2">
                  {cat.title}
                </h3>

                <p className="text-sm text-gray-500 mb-4">{cat.desc}</p>

                <button className="text-blue-600 flex items-center gap-1 text-sm font-medium">
                  Explore <ChevronRight size={16} />
                </button>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}