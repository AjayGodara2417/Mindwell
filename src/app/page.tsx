"use client"; // Required for the toggle state

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Activity, ShieldCheck, Users, BrainCircuit, ArrowRight, 
  BarChart3, HeartPulse, ClipboardCheck, Lock, 
  Smartphone, Bell, Database, HardDrive, HelpCircle, Menu, X 
} from 'lucide-react';

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans overflow-x-hidden">
      {/* --- NAVIGATION --- */}
      <nav className="flex items-center justify-between px-6 md:px-12 py-5 bg-white/90 backdrop-blur-md border-b border-slate-200 sticky top-0 z-[100]">
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-9 h-9 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">M</div>
          <span className="text-xl font-bold tracking-tight text-indigo-900 uppercase">MindWell</span>
        </div>

        {/* Desktop Links */}
        <div className="hidden lg:flex gap-10 font-medium text-slate-600">
          <Link href="/features" className="hover:text-indigo-600 transition-colors">Features</Link>
          <Link href="/contact" className="hover:text-indigo-600 transition-colors">Contact Us</Link>
          <Link href="/about" className="hover:text-indigo-600 transition-colors">How it works</Link>
        </div>

        {/* Desktop Auth */}
        <div className="hidden lg:flex items-center gap-4">
          <Link href="/login" className="px-6 py-2.5 font-semibold text-slate-700 hover:text-indigo-600 transition">Log in</Link>
          <Link href="/signup" className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition shadow-lg shadow-indigo-100">
            Get Started
          </Link>
        </div>

        {/* Hamburger Icon */}
        <button 
          onClick={toggleMenu}
          className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition"
          aria-label="Toggle Menu"
        >
          {isMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
        </button>

        {/* Mobile Sidebar Menu */}
      </nav>

      {/* MOBILE MENU FIXED */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[999]">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsMenuOpen(false)}
          />

          {/* Drawer */}
          <div className="absolute right-0 top-0 h-full w-[80%] max-w-sm bg-white shadow-2xl p-6 flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <span className="font-bold text-indigo-600">MENU</span>
              <button onClick={() => setIsMenuOpen(false)}>
                <X />
              </button>
            </div>

            {/* Links */}
            <div className="flex flex-col gap-6 text-lg font-semibold text-slate-700">
              <Link href="/features" onClick={() => setIsMenuOpen(false)}>Features</Link>
              <Link href="/contact" onClick={() => setIsMenuOpen(false)}>Contact Us</Link>
              <Link href="/about" onClick={() => setIsMenuOpen(false)}>How it works</Link>

              <div className="border-t pt-6 mt-4" />

              <Link href="/login" className="text-slate-500" onClick={() => setIsMenuOpen(false)}>
                Log in
              </Link>

              <Link
                href="/signup"
                onClick={() => setIsMenuOpen(false)}
                className="bg-indigo-600 text-white text-center py-3 rounded-xl font-semibold"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* --- HERO SECTION --- */}
      <header className="px-6 md:px-12 py-16 md:py-28 max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        <div className="space-y-8 text-center lg:text-left">
          <div className="inline-block px-4 py-1.5 bg-indigo-50 border border-indigo-100 text-indigo-700 rounded-full text-sm font-bold tracking-wide">
            Next-Gen Depression Analysis
          </div>
          <h1 className="text-4xl md:text-6xl font-black leading-[1.1] text-slate-900">
            Data-Driven Care for <br />
            <span className="text-indigo-600 italic">Mental Wellness.</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-xl mx-auto lg:mx-0">
            A specialized platform connecting patients and doctors through advanced depression analysis and seamless clinical management.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Link href="/signup" className="group flex items-center justify-center gap-2 px-10 py-5 bg-indigo-600 text-white rounded-2xl font-bold text-lg hover:bg-indigo-700 transition transform hover:-translate-y-1">
              Start Analysis <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
            </Link>
          </div>
        </div>
        
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
          <div className="relative bg-white p-3 md:p-6 rounded-3xl shadow-2xl border border-slate-200">
            <div className="bg-slate-900 rounded-2xl p-6 h-64 md:h-96 flex flex-col gap-6">
              <div className="h-8 w-1/3 bg-slate-800 rounded-lg"></div>
              <div className="flex gap-6 h-full">
                <div className="w-2/3 bg-indigo-500/10 rounded-xl border border-indigo-500/20 flex items-center justify-center">
                  <Activity className="text-indigo-500 w-16 h-16 animate-pulse" />
                </div>
                <div className="w-1/3 space-y-4">
                   <div className="h-1/2 bg-slate-800 rounded-xl"></div>
                   <div className="h-1/4 bg-slate-800 rounded-xl"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* --- PLATFORM CAPABILITIES --- */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-3xl md:text-4xl font-black mb-6 text-slate-900">Platform Capabilities</h2>
            <p className="text-lg text-slate-500">Precision-engineered with TypeScript to meet modern clinical standards.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-10">
            <FeatureCard 
              icon={<BrainCircuit className="w-8 h-8 text-indigo-600" />}
              title="Intelligent Analysis"
              desc="Our custom API engine processes behavioral data to provide early indicators of depressive patterns."
            />
            <FeatureCard 
              icon={<Users className="w-8 h-8 text-indigo-600" />}
              title="Doctor-Patient Portal"
              desc="Direct management tools for clinicians to track patient progress and intervention history."
            />
            <FeatureCard 
              icon={<ShieldCheck className="w-8 h-8 text-indigo-600" />}
              title="HIPAA-Ready Security"
              desc="Encrypted data handling ensuring patient confidentiality and secure certificate management."
            />
          </div>
        </div>
      </section>

      {/* --- ANALYSIS ENGINE (DARK SECTION) --- */}
      <section className="py-24 bg-slate-900 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-10">
              <h2 className="text-4xl font-bold">Advanced Depression Analytics Engine</h2>
              <p className="text-slate-400 text-lg leading-relaxed">
                Utilizing our proprietary <code className="text-indigo-400 bg-slate-800 px-2 py-1 rounded">/api/analysis</code> 
                layer, we process multi-dimensional data points for clinical insights.
              </p>
              
              <div className="space-y-8">
                {[
                  { title: "Pattern Recognition", desc: "Identifies shifts in daily activity and sleep cycles." },
                  { title: "Sentiment Analysis", desc: "Analyzes linguistic markers in journals." },
                  { title: "Clinical Metrics", desc: "Maps data against PHQ-9 and GAD-7 standards." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-6">
                    <div className="shrink-0 w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/50 flex items-center justify-center text-indigo-400 font-black">
                      0{i + 1}
                    </div>
                    <div>
                      <h4 className="font-bold text-xl mb-1">{item.title}</h4>
                      <p className="text-slate-400 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative group">
              <div className="absolute inset-0 bg-indigo-500/20 blur-[100px] rounded-full group-hover:bg-indigo-500/30 transition"></div>
              <div className="relative bg-slate-800 border border-slate-700 rounded-[2.5rem] p-10 shadow-2xl">
                <div className="flex justify-between items-center mb-10">
                  <span className="text-xs font-mono text-indigo-400 tracking-widest">ANALYSIS_LOG.TS</span>
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-slate-700"></div>
                    <div className="w-3 h-3 rounded-full bg-slate-700"></div>
                    <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                  </div>
                </div>
                <div className="space-y-5">
                  <div className="h-4 bg-slate-700/50 rounded-full w-3/4"></div>
                  <div className="h-4 bg-slate-700/50 rounded-full w-full"></div>
                  <div className="grid grid-cols-3 gap-4 py-8">
                    {[1,2,3].map(i => <div key={i} className="h-24 bg-indigo-500/5 rounded-2xl border border-indigo-500/20 animate-pulse"></div>)}
                  </div>
                  <div className="h-4 bg-slate-700/50 rounded-full w-5/6"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- DOCTOR SECTION --- */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex flex-col md:flex-row items-center justify-between mb-20 gap-8">
            <h2 className="text-4xl font-black text-slate-900 text-center md:text-left leading-tight">
              Built for Practitioners, <br />Designed for Patients.
            </h2>
            <Link href="/doctors" className="px-8 py-4 border-2 border-slate-900 rounded-2xl font-bold hover:bg-slate-900 hover:text-white transition-all shadow-lg shadow-slate-100">
              View Doctor Portal
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: <ClipboardCheck />, label: "Case Management", detail: "Track patient history from your dashboard." },
              { icon: <BarChart3 />, label: "Real-time Metrics", detail: "Visual progress charts for every patient." },
              { icon: <HeartPulse />, label: "Early Warnings", detail: "Automated alerts for high-risk data changes." },
              { icon: <Lock />, label: "HIPAA Compliant", detail: "End-to-end encryption for all records." },
            ].map((stat, i) => (
              <div key={i} className="p-8 bg-slate-50 rounded-3xl border border-slate-100 group hover:bg-white hover:shadow-xl transition-all">
                <div className="text-indigo-600 mb-6 group-hover:scale-110 transition">{stat.icon}</div>
                <h4 className="font-bold text-slate-900 mb-3">{stat.label}</h4>
                <p className="text-sm text-slate-500 leading-relaxed">{stat.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- STATS BAR --- */}
      <section className="py-16 bg-indigo-50 border-y border-indigo-100">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-12 text-center">
          {[
            { val: "94%", label: "Accuracy Rate" },
            { val: "10k+", label: "Active Patients" },
            { val: "500+", label: "Verified Doctors" },
            { val: "24/7", label: "Monitoring" }
          ].map((stat, i) => (
            <div key={i}>
              <div className="text-4xl font-black text-indigo-600 mb-2">{stat.val}</div>
              <div className="text-xs text-indigo-400 uppercase tracking-[0.2em] font-bold">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* --- PATIENT EXPERIENCE --- */}
      <section className="py-24 bg-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 grid lg:grid-cols-2 gap-20 items-center">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 order-2 lg:order-1">
            <div className="space-y-6 mt-8">
              <div className="bg-white/10 p-8 rounded-[2rem] backdrop-blur-xl border border-white/20">
                <Smartphone className="mb-6 text-indigo-200" />
                <h4 className="font-bold text-xl mb-2">Daily Check-ins</h4>
                <p className="text-indigo-100 leading-relaxed">Simple, empathetic mood tracking for patients.</p>
              </div>
              <div className="bg-white/10 p-8 rounded-[2rem] backdrop-blur-xl border border-white/20">
                <Bell className="mb-6 text-indigo-200" />
                <h4 className="font-bold text-xl mb-2">Smart Alerts</h4>
                <p className="text-indigo-100 leading-relaxed">Nudges for medication and therapy sessions.</p>
              </div>
            </div>
            <div className="bg-white/10 p-8 rounded-[2rem] backdrop-blur-xl border border-white/20 h-fit self-center">
              <HeartPulse className="mb-6 text-indigo-200" />
              <h4 className="font-bold text-xl mb-2">Wellness Log</h4>
              <p className="text-indigo-100 leading-relaxed">Visualizing long-term recovery patterns.</p>
            </div>
          </div>
          <div className="order-1 lg:order-2 space-y-8 text-center lg:text-left">
            <h2 className="text-4xl md:text-5xl font-black leading-tight">Patient Recovery <br />Journey</h2>
            <p className="text-indigo-100 text-lg leading-relaxed max-w-lg">
              Designed with accessibility and empathy. We provide patients with tools to understand 
              their own data without overwhelming them.
            </p>
            <div className="flex flex-col gap-4">
              {["Privacy-first collection", "Secure Messaging", "Accessible Reports"].map(text => (
                <div key={text} className="flex items-center gap-4 justify-center lg:justify-start">
                  <div className="w-2 h-2 bg-indigo-300 rounded-full" />
                  <span className="font-medium">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* --- INFRASTRUCTURE --- */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-16">Clinical-Grade Infrastructure</h2>
          <div className="grid md:grid-cols-3 gap-16">
            {[
              { icon: <Database />, title: "Isolated Storage", desc: "Encrypted at rest using industry-standard AES-256." },
              { icon: <HardDrive />, title: "Secure Config", desc: "Strict .env and certificate management for API safety." },
              { icon: <ShieldCheck />, title: "Audit Logging", desc: "Interaction logging for HIPAA compliance audits." }
            ].map((box, i) => (
              <div key={i} className="space-y-4">
                <div className="mx-auto w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-600 border border-slate-100">{box.icon}</div>
                <h4 className="font-bold text-lg">{box.title}</h4>
                <p className="text-sm text-slate-500 leading-relaxed">{box.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- FAQ --- */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-3xl mx-auto px-6">
          <div className="flex items-center gap-4 mb-12">
            <div className="p-3 bg-indigo-600 rounded-xl text-white"><HelpCircle /></div>
            <h2 className="text-3xl font-black text-slate-900">Common Questions</h2>
          </div>
          <div className="space-y-6">
            {[
              { q: "How accurate is the depression analysis?", a: "Our models combine PHQ-9 benchmarks with behavioral data trends for clinical precision." },
              { q: "Is my data shared with third parties?", a: "Never. Your data belongs to you and your authorized healthcare provider." },
              { q: "How do I invite my doctor?", a: "Generate a secure invite link from your dashboard to connect with your care provider." }
            ].map((faq, i) => (
              <details key={i} className="group bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition-all duration-300">
                <summary className="p-6 font-bold text-slate-900 cursor-pointer list-none flex justify-between items-center group-open:bg-indigo-50 group-open:text-indigo-600">
                  {faq.q}
                  <ArrowRight className="w-4 h-4 transition-transform group-open:rotate-90" />
                </summary>
                <div className="p-6 pt-0 text-slate-600 leading-relaxed text-sm">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* --- FINAL CTA --- */}
      <section className="py-24 bg-white text-center px-6">
        <div className="max-w-2xl mx-auto space-y-10">
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight">Ready to transform <br />mental health care?</h2>
          <p className="text-lg text-slate-500">Join the waitlist or start your 14-day clinical trial today.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup" className="px-10 py-5 bg-indigo-600 text-white rounded-2xl font-bold text-lg hover:shadow-2xl transition hover:-translate-y-1">Get Started Now</Link>
            <Link href="/contact" className="px-10 py-5 bg-slate-100 text-slate-700 rounded-2xl font-bold text-lg hover:bg-slate-200 transition">Contact Sales</Link>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-slate-50 border-t border-slate-200 py-16">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex flex-col items-center md:items-start gap-4 text-center md:text-left">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xs">M</div>
              <span className="text-sm font-bold text-slate-900 uppercase tracking-widest">MindWell</span>
            </div>
            <p className="text-slate-400 text-xs">© 2026 STRESS Platform. Clinical Depression Analysis Engine.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-8 text-[10px] font-mono text-slate-400 uppercase tracking-widest">
            <span>Next.config.ts</span>
            <span>Tailwind.css</span>
            <span>ESLint.config.mjs</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="p-10 rounded-[2.5rem] border border-slate-100 bg-white hover:border-indigo-100 hover:shadow-2xl transition-all group">
      <div className="mb-8 p-4 bg-indigo-50 rounded-2xl w-fit group-hover:bg-indigo-600 group-hover:text-white transition-all transform group-hover:rotate-6">
        {icon}
      </div>
      <h3 className="text-2xl font-black mb-4 text-slate-900 leading-tight">{title}</h3>
      <p className="text-slate-600 leading-relaxed">{desc}</p>
    </div>
  );
}