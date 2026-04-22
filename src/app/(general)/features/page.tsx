import React from 'react';
import Link from 'next/link';
import { 
  Brain, 
  UserRound, 
  LineChart, 
  ShieldAlert, 
  FolderLock, 
  Zap, 
  MessageSquare, 
  FileText,
  Settings2
} from 'lucide-react';

export default function FeaturesPage() {
  const clinicalFeatures = [
    {
      title: "Doctor-Patient Management",
      description: "Found in /app/(doctors), this module provides a dedicated interface for clinicians to manage their roster, view history, and schedule interventions.",
      icon: <UserRound className="w-6 h-6" />,
      tag: "Core Module"
    },
    {
      title: "Predictive Analysis Engine",
      description: "Our /api logic uses historical data from the 'constants' and 'lib' folders to predict depressive episodes before they peak.",
      icon: <Brain className="w-6 h-6" />,
      tag: "AI Powered"
    },
    {
      title: "Real-time Wellness Logs",
      description: "Patient check-ins are processed through secure TypeScript interfaces to ensure data integrity and zero-loss reporting.",
      icon: <LineChart className="w-6 h-6" />,
      tag: "Live Data"
    }
  ];

  const techFeatures = [
    { title: "Next.js 15 App Router", detail: "Optimized routing for medical dashboards." },
    { title: "TypeScript Safety", detail: "End-to-end type safety for patient records." },
    { title: "Tailwind Styling", detail: "Responsive, accessible, and clean UI/UX." },
    { title: "Secure API Routes", detail: "Protected endpoints for sensitive data." }
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* Header Section */}
      <section className="bg-slate-50 py-20 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-8 text-center">
          <h1 className="text-5xl font-extrabold text-slate-900 mb-6">
            Clinical Features for <span className="text-indigo-600">Precision Mental Health</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Everything you need to analyze, manage, and treat depression using a data-driven approach. 
            Built on a foundation of security and clinical accuracy.
          </p>
        </div>
      </section>

      {/* Main Features Grid */}
      <section className="py-24 max-w-7xl mx-auto px-8">
        <div className="grid lg:grid-cols-3 gap-12">
          {clinicalFeatures.map((f, i) => (
            <div key={i} className="group p-8 rounded-3xl border border-slate-100 hover:border-indigo-100 hover:shadow-xl transition-all">
              <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                {f.icon}
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-500 mb-2 block">{f.tag}</span>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">{f.title}</h3>
              <p className="text-slate-600 leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Detailed Feature Breakdown */}
      <section className="py-24 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-10">
              <h2 className="text-4xl font-bold">Deep Functional Overview</h2>
              
              <div className="flex gap-6">
                <div className="mt-1 bg-indigo-500 p-2 rounded-lg"><ShieldAlert className="w-5 h-5 text-white" /></div>
                <div>
                  <h4 className="text-xl font-bold mb-2">Crisis Intervention System</h4>
                  <p className="text-slate-400 font-light">Automated flags when patient data crosses a critical threshold. Alerts are routed instantly to the Doctor Portal.</p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="mt-1 bg-indigo-500 p-2 rounded-lg"><FolderLock className="w-5 h-5 text-white" /></div>
                <div>
                  <h4 className="text-xl font-bold mb-2">Encrypted Certificate Store</h4>
                  <p className="text-slate-400 font-light">Managing clinical credentials and platform keys securely within the /certs directory to ensure HIPAA compliance.</p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="mt-1 bg-indigo-500 p-2 rounded-lg"><MessageSquare className="w-5 h-5 text-white" /></div>
                <div>
                  <h4 className="text-xl font-bold mb-2">Direct Care Communication</h4>
                  <p className="text-slate-400 font-light">Encrypted messaging bridge between patients and doctors for immediate support and check-ins.</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-800 rounded-3xl p-8 border border-slate-700 shadow-2xl">
              <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
                <Settings2 className="text-indigo-400" /> Platform Architecture
              </h3>
              <div className="space-y-6">
                {techFeatures.map((tech, i) => (
                  <div key={i} className="flex justify-between items-center border-b border-slate-700 pb-4 last:border-0">
                    <div>
                      <div className="font-bold">{tech.title}</div>
                      <div className="text-sm text-slate-500">{tech.detail}</div>
                    </div>
                    <Zap className="w-4 h-4 text-indigo-400" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature List Section */}
      <section className="py-24 max-w-7xl mx-auto px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-900">Additional Capabilities</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { icon: <FileText />, t: "E-Prescriptions", d: "Digital scripts sent directly to pharmacies." },
            { icon: <Zap />, t: "Instant Sync", d: "Cross-device synchronization for patient logs." },
            { icon: <Settings2 />, t: "Custom Config", d: "Tailored clinical settings via next.config.ts." },
            { icon: <UserRound />, t: "Guest Access", d: "Secure family viewer modes for care circles." },
          ].map((item, i) => (
            <div key={i} className="flex gap-4 items-start">
              <div className="text-indigo-600">{item.icon}</div>
              <div>
                <h5 className="font-bold text-slate-900">{item.t}</h5>
                <p className="text-sm text-slate-500 mt-1">{item.d}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 border-t border-slate-100 text-center">
        <div className="max-w-2xl mx-auto px-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Want to see these features in action?</h2>
          <p className="text-slate-600 mb-8">Schedule a demo with our clinical specialists today.</p>
          <div className="flex justify-center gap-4">
            <Link href="/signup" className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700">Get Started</Link>
            <Link href="/doctors" className="px-8 py-3 border border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-50">View Documentation</Link>
          </div>
        </div>
      </section>
    </div>
  );
}