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
    },
    {
      title: "Depression",
      desc: "Learn about depression and pathways to recovery.",
      icon: Heart,
    },
    {
      title: "Sleep Hygiene",
      desc: "Improve mental health through better sleep.",
      icon: Moon,
    },
    {
      title: "Relationships",
      desc: "Communication and healthy boundaries.",
      icon: MessageSquare,
    },
    {
      title: "Resilience",
      desc: "Build strength to face life challenges.",
      icon: Zap,
    },
    {
      title: "Mindfulness",
      desc: "Stay present and cultivate calmness.",
      icon: BookOpen,
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-12 p-8">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold text-gray-900">
          Support & Resources
        </h1>
        <p className="text-gray-500 mt-2 text-sm">
          Helpful tools and guidance for your mental wellbeing.
        </p>
      </div>

      {/* Emergency Section (Soft UI) */}
      <section className="bg-[#fff5f5] border border-red-200 rounded-2xl p-6">

        <div className="flex items-center gap-2 text-red-600 font-medium mb-3">
          <ShieldAlert size={18} />
          Emergency Support
        </div>

        <p className="text-sm text-gray-600 mb-5">
          If you are in immediate distress, please reach out for help.
        </p>

        <div className="grid md:grid-cols-2 gap-4">

          <a
            href="tel:988"
            className="bg-red-500 text-white px-5 py-4 rounded-xl flex justify-between items-center hover:opacity-90 transition"
          >
            Call 988
            <Phone size={18} />
          </a>

          <a
            href="sms:741741"
            className="bg-white border border-red-200 px-5 py-4 rounded-xl flex justify-between items-center hover:bg-red-50 transition"
          >
            Text HOME to 741741
            <MessageSquare size={18} className="text-red-500" />
          </a>

        </div>
      </section>

      {/* Categories */}
      <section>

        <h2 className="text-lg font-medium text-gray-800 mb-6">
          Explore Topics
        </h2>

        <div className="grid md:grid-cols-3 gap-6">

          {categories.map((cat, i) => {
            const Icon = cat.icon;

            return (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition cursor-pointer"
              >

                {/* Icon */}
                <div className="w-11 h-11 rounded-xl bg-[#eef3f1] flex items-center justify-center mb-4">
                  <Icon size={20} className="text-[#2f5d50]" />
                </div>

                {/* Title */}
                <h3 className="font-medium text-gray-900 mb-1">
                  {cat.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-gray-500 mb-4 leading-relaxed">
                  {cat.desc}
                </p>

                {/* CTA */}
                <div className="flex items-center justify-between text-sm text-[#2f5d50]">

                  <span className="flex items-center gap-1">
                    Explore
                    <ChevronRight size={16} />
                  </span>

                  <div className="w-8 h-8 rounded-full bg-[#eef3f1] flex items-center justify-center">
                    <ChevronRight size={16} />
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