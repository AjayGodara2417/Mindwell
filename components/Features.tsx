import { BarChart3, ClipboardList, LineChart } from "lucide-react";

export default function Features() {
  const features = [
    {
      icon: BarChart3,
      title: "Personalized Stats",
      desc: "Track your emotional journey with clarity.",
    },
    {
      icon: ClipboardList,
      title: "Quiet Journaling",
      desc: "Write freely in a distraction-free space.",
    },
    {
      icon: LineChart,
      title: "Emotion Detection",
      desc: "AI insights to guide your mental wellness.",
    },
  ];

  return (
    <div className="grid md:grid-cols-3 gap-8">
      {features.map((f, i) => {
        const Icon = f.icon;

        return (
          <div
            key={i}
            className="group bg-white border rounded-3xl p-6 hover:shadow-lg transition"
          >
            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition">
              <Icon className="text-indigo-600" />
            </div>

            <h3 className="font-semibold text-lg text-gray-900">
              {f.title}
            </h3>

            <p className="text-gray-600 mt-2 text-sm leading-relaxed">
              {f.desc}
            </p>
          </div>
        );
      })}
    </div>
  );
}