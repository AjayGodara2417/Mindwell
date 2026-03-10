import { BarChart3, ClipboardList, LineChart } from "lucide-react";

export default function Features() {
  const features = [
    {
      icon: BarChart3,
      title: "Mood Tracking",
      description:
        "Log your emotional state daily to identify patterns and triggers in your mental health journey.",
    },
    {
      icon: ClipboardList,
      title: "Daily Planning",
      description:
        "Stay organized and mindful with structured daily plans tailored to your recovery and wellness goals.",
    },
    {
      icon: LineChart,
      title: "Clinician Insights",
      description:
        "Provide your healthcare provider with real-time data to ensure your treatment plan is always on track.",
    },
  ];

  return (
    <section className="bg-[#f3f4f6] py-24">
      <div className="max-w-7xl mx-auto px-6">

        {/* Heading */}
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900">
            Tools for Better Mental Health
          </h2>

          <p className="mt-4 text-gray-600 text-lg">
            Our platform provides comprehensive tools designed to bridge the gap
            between daily life and clinical support.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="mt-16 grid md:grid-cols-3 gap-8">

          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-lg transition"
              >
                
                {/* Icon */}
                <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-blue-100 mb-6">
                  <Icon className="text-blue-600" size={24} />
                </div>

                {/* Title */}
                <h3 className="text-xl font-semibold text-gray-900">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="mt-4 text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}

        </div>
      </div>
    </section>
  );
}