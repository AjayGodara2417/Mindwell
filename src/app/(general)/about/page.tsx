import React from 'react';
import Link from 'next/link';
import { Heart, ShieldCheck, Microscope, Users2, Code2, Globe2 } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="bg-white min-h-screen">
      {/* 1. Mission Section */}
      <section className="relative py-24 bg-slate-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-8 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-black text-slate-900 mb-8 leading-tight">
              We’re redefining how <span className="text-indigo-600">depression</span> is understood and managed.
            </h1>
            <p className="text-xl text-slate-600 leading-relaxed">
              STRESS was born from a simple observation: mental health care lacks the real-time data 
              visibility found in other medical fields. By leveraging modern technology, we provide 
              clinicians and patients with the insights they need to make informed decisions.
            </p>
          </div>
        </div>
        {/* Decorative Background Element */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-indigo-600/5 -skew-x-12 translate-x-20 hidden lg:block"></div>
      </section>

      {/* 2. The Values Grid */}
      <section className="py-24 max-w-7xl mx-auto px-8">
        <div className="grid md:grid-cols-3 gap-12">
          <ValueCard 
            icon={<Heart className="w-8 h-8 text-rose-500" />}
            title="Empathy by Design"
            description="Our (main_pages) interface is built specifically for users in distress, prioritizing ease of use, dark-mode accessibility, and calm aesthetics."
          />
          <ValueCard 
            icon={<ShieldCheck className="w-8 h-8 text-indigo-600" />}
            title="Clinical Integrity"
            description="We don't just track data. We use standardized medical constants and HIPAA-compliant libraries to ensure every insight is medically sound."
          />
          <ValueCard 
            icon={<Microscope className="w-8 h-8 text-emerald-600" />}
            title="Data-Driven Hope"
            description="Our analysis engine looks for patterns in recovery, helping patients see their progress even on days when they feel they've made none."
          />
        </div>
      </section>

      {/* 3. The Tech Story (Connecting back to your image) */}
      <section className="py-24 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-8 grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <h2 className="text-4xl font-bold">Built for Reliability</h2>
            <p className="text-slate-400 text-lg leading-relaxed">
              Our platform architecture is built using **Next.js 15** and **TypeScript** to ensure 
              zero-fail connectivity between patients and doctors. 
            </p>
            <div className="grid grid-cols-2 gap-8 pt-6">
              <div className="flex items-center gap-3">
                <Code2 className="text-indigo-400" />
                <span className="font-mono text-sm">Type-Safe Records</span>
              </div>
              <div className="flex items-center gap-3">
                <Globe2 className="text-indigo-400" />
                <span className="font-mono text-sm">Real-time Syncing</span>
              </div>
            </div>
          </div>
          
          <div className="relative p-8 border border-slate-700 bg-slate-800 rounded-3xl shadow-inner">
             <h4 className="text-indigo-400 font-mono mb-4 text-sm"> src/lib/mission.ts</h4>
             <p className="text-slate-300 italic font-light leading-relaxed">
               Our goal is to reduce the global burden of depression by 20% through 
               early detection and seamless clinician-to-patient communication protocols.
             </p>
          </div>
        </div>
      </section>

      {/* 4. Leadership / Community Section */}
      <section className="py-24 max-w-7xl mx-auto px-8 text-center">
        <div className="max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">A Global Network of Care</h2>
          <p className="text-slate-500">
            STRESS is supported by a diverse team of software engineers, clinical psychologists, 
            and data scientists working across 12 countries.
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
           {[
             { label: "Founded", val: "2024" },
             { label: "Verification", val: "HIPAA/GDPR" },
             { label: "API Uptime", val: "99.99%" },
             { label: "Community", val: "Open Source" },
           ].map((stat, i) => (
             <div key={i} className="p-6 border border-slate-100 rounded-2xl">
               <div className="text-2xl font-bold text-indigo-600">{stat.val}</div>
               <div className="text-xs uppercase tracking-widest text-slate-400 font-bold">{stat.label}</div>
             </div>
           ))}
        </div>
      </section>

      {/* 5. Final Call to Action */}
      <section className="pb-24 pt-12 px-8">
        <div className="max-w-5xl mx-auto bg-indigo-600 rounded-[3rem] p-12 md:p-20 text-center text-white relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-4xl font-bold mb-6">Want to learn more about our methodology?</h2>
            <p className="text-indigo-100 mb-10 max-w-xl mx-auto text-lg">
              Download our whitepaper on predictive mental health analysis or talk to our clinical lead.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/signup" className="bg-white text-indigo-600 px-8 py-4 rounded-2xl font-bold hover:bg-slate-50 transition">
                Join the Platform
              </Link>
              <Link href="/contact" className="bg-indigo-700 text-white border border-indigo-500 px-8 py-4 rounded-2xl font-bold hover:bg-indigo-800 transition">
                Contact Our Team
              </Link>
            </div>
          </div>
          {/* Abstract background circles */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-1/4 translate-y-1/4"></div>
        </div>
      </section>
    </div>
  );
}

function ValueCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="space-y-4">
      <div className="mb-6">{icon}</div>
      <h3 className="text-xl font-bold text-slate-900">{title}</h3>
      <p className="text-slate-600 leading-relaxed text-sm md:text-base">
        {description}
      </p>
    </div>
  );
}