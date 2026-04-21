"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Brain, Zap, Timer, Layers, Icon } from "lucide-react";

const tests = [
  {
    title: "Memory Test",
    description: "Assess short-term and working memory using structured tasks.",
    icon: Brain,
    path: "/activites/memory",
  },
  {
    title: "Attention Test",
    description: "Evaluate focus and sustained attention levels.",
    icon: Zap,
    path: "/activites/attention",
  },
  {
    title: "Processing Speed",
    description: "Measure reaction time and cognitive speed.",
    icon: Timer,
    path: "/activites/speed",
  },
  {
    title: "Executive Function",
    description: "Analyze decision-making and task switching ability.",
    icon: Layers,
    path: "/activites/executive",
  },
  {
    title: "Visual Memory",
    description: "Test visual pattern memory and recall ability.",
    icon: Brain,
    path: "/activites/memory/visual-memory",
  },
  {
    title: "Attention (CPT)",
    description: "Evaluate sustained attention and impulse control.",
    icon: Zap,
    path: "/activites/attention/cpt",
  },
  {
    title: "Trail Making Test",
    description: "Assess processing speed and task switching ability.",
    icon: Layers,
    path: "/activites/executive/trail-making",
  },
  {
    title: "Symbol-Digit Matching",
    description: "Measure processing speed and symbol recognition.",
    icon: Timer,
    path: "/activites/speed/symbol-digit",
  },
  {
    title: "Emotional Stroop",
    description: "Assess emotional processing and cognitive bias.",
    icon: Brain,
    path: "/activites/attention/emotional-stroop",
  },
  {
    title: "Memory Bias Test",
    description: "Detect emotional bias in memory recall.",
    icon: Brain,
    path: "/activites/memory/negative-bias",
  },
];

export default function CognitiveAssessmentPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#f6f9f8]">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-10">
        <div className="flex justify-between">
          <h1 className="text-3xl md:text-4xl font-bold text-[#2f5d50]">
            Cognitive Assessment
          </h1>
          <button
            onClick={() => router.push("/activites/cognitivedashboard")}
            className="mt-6 w-fit p-8 bg-[#2f5d50] text-white py-2.5 rounded-xl text-sm font-medium hover:bg-[#274f45] transition"
          >
            Activities Result
          </button>
        </div>
        <p className="text-gray-500 mt-2 max-w-2xl">
          Evaluate key cognitive domains including memory, attention,
          processing speed, and executive function through structured
          assessments.
        </p>
      </div>

      {/* Cards Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {tests.map((test, index) => {
          const Icon = test.icon;

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-sm p-6 flex flex-col justify-between hover:shadow-md transition"
            >
              <div>
                <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-[#e8f3f1] mb-4">
                  <Icon className="text-[#2f5d50]" />
                </div>

                <h2 className="text-lg font-semibold text-[#2f5d50]">
                  {test.title}
                </h2>

                <p className="text-sm text-gray-500 mt-2">
                  {test.description}
                </p>
              </div>

              <button
                onClick={() => router.push(test.path)}
                className="mt-6 w-full bg-[#2f5d50] text-white py-2 rounded-xl text-sm font-medium hover:bg-[#274f45] transition"
              >
                Start Assessment
              </button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
