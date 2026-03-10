"use client";

import { Phone, MessageSquare, Heart, Moon, Zap, Smile } from "lucide-react";

export default function ResourcesPage() {
  const categories = [
    {
      title: "Anxiety & Stress",
      desc: "Techniques and tools for managing daily stress and anxiety symptoms.",
      icon: Smile,
    },
    {
      title: "Depression",
      desc: "Understanding depression and finding paths toward recovery and hope.",
      icon: Heart,
    },
    {
      title: "Sleep Hygiene",
      desc: "Improve your mental well-being through better rest and routines.",
      icon: Moon,
    },
    {
      title: "Relationships",
      desc: "Navigating social connections, boundaries, and communication skills.",
      icon: Heart,
    },
    {
      title: "Resilience",
      desc: "Building inner strength to bounce back from life’s challenges.",
      icon: Zap,
    },
    {
      title: "Mindfulness",
      desc: "Practices to stay present and cultivate a peaceful mind every day.",
      icon: Smile,
    },
  ];

  const articles = [
    {
      title: "Finding Stillness: A Beginner's Guide to Daily Meditation",
      desc: "Learn how five minutes a day can reshape your neurological response to stress.",
      img: "https://images.unsplash.com/photo-1506126613408-eca07ce68773",
    },
    {
      title: "The Power of Journaling for Emotional Regulation",
      desc: "Scientific evidence shows that writing down your thoughts can lower anxiety.",
      img: "https://images.unsplash.com/photo-1517842645767-c639042777db",
    },
    {
      title: "How to Set Healthy Boundaries Without Guilt",
      desc: "Expert advice on protecting your energy in personal and professional spaces.",
      img: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac",
    },
  ];

  return (
    <div className="text-white max-w-6xl mx-auto">

      {/* Page Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold">Support & Resources</h1>
        <p className="text-gray-400 mt-2">
          Find the help and professional information you need to support your
          mental well-being. You are not alone on this journey.
        </p>
      </div>

      {/* Emergency Support */}
      <div className="bg-[#101d35] border border-[#1b2a41] rounded-xl p-6 mb-10">
        <h2 className="text-lg font-semibold text-red-400 mb-2">
          Emergency Support
        </h2>

        <p className="text-gray-400 mb-6">
          If you or someone you know is in immediate danger or experiencing a
          crisis, please use these confidential 24/7 services.
        </p>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="flex items-center justify-between bg-blue-600 p-5 rounded-lg">
            <div>
              <p className="text-sm opacity-80">CRISIS HOTLINE</p>
              <p className="text-xl font-semibold">Call 988</p>
            </div>

            <Phone />
          </div>

          <div className="flex items-center justify-between bg-[#16243e] border border-blue-500 p-5 rounded-lg">
            <div>
              <p className="text-sm text-gray-400">CRISIS TEXT LINE</p>
              <p className="text-blue-400 font-semibold">
                Text HOME to 741741
              </p>
            </div>

            <MessageSquare />
          </div>
        </div>
      </div>

      {/* Resource Categories */}
      <div className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Resource Categories</h2>
          <button className="text-blue-400 text-sm">View All Topics</button>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {categories.map((cat, i) => {
            const Icon = cat.icon;

            return (
              <div
                key={i}
                className="bg-[#101d35] border border-[#1b2a41] p-6 rounded-xl hover:border-blue-500 transition"
              >
                <Icon className="text-blue-400 mb-4" />

                <h3 className="font-semibold mb-2">{cat.title}</h3>

                <p className="text-gray-400 text-sm">
                  {cat.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recommended Reading */}
      <div>
        <h2 className="text-xl font-semibold mb-6">Recommended Reading</h2>

        <div className="space-y-4">
          {articles.map((article, i) => (
            <div
              key={i}
              className="flex items-center gap-5 bg-[#101d35] border border-[#1b2a41] p-4 rounded-xl"
            >
              <img
                src={article.img}
                alt=""
                className="w-24 h-16 object-cover rounded-lg"
              />

              <div>
                <h3 className="font-semibold">{article.title}</h3>
                <p className="text-gray-400 text-sm">
                  {article.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <button className="border border-[#1b2a41] px-6 py-2 rounded-lg hover:border-blue-500">
            Load More Articles
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="text-gray-500 text-sm mt-16 border-t border-[#1b2a41] pt-6 flex justify-between">
        <p>© 2024 MindWell Wellness Inc.</p>

        <div className="flex gap-6">
          <span>Privacy Policy</span>
          <span>Terms of Service</span>
        </div>
      </div>
    </div>
  );
}