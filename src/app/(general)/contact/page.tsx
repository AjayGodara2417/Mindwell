import React from 'react';
import { Mail, Phone, MapPin, MessageSquare, Clock, Globe } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Header */}
      <div className="bg-slate-900 py-20 px-8 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Get in Touch</h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
            Have questions about our depression analysis engine or clinical management tools? 
            Our team is here to support healthcare providers and patients alike.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-20">
        <div className="grid lg:grid-cols-3 gap-12">
          
          {/* Column 1: Contact Info */}
          <div className="space-y-10">
            <div>
              <h3 className="text-2xl font-bold text-slate-900 mb-6">Contact Information</h3>
              <p className="text-slate-600 mb-8">
                Reach out to us directly. We aim to respond to all clinical inquiries within 24 hours.
              </p>
            </div>

            <div className="space-y-6">
              <ContactInfoItem 
                icon={<Mail className="w-5 h-5 text-indigo-600" />} 
                title="Email" 
                content="support@stress-platform.com" 
              />
              <ContactInfoItem 
                icon={<Phone className="w-5 h-5 text-indigo-600" />} 
                title="Phone" 
                content="+1 (555) 000-1234" 
              />
              <ContactInfoItem 
                icon={<MapPin className="w-5 h-5 text-indigo-600" />} 
                title="Office" 
                content="123 Health-Tech Plaza, San Francisco, CA" 
              />
            </div>

            <div className="p-6 bg-indigo-50 rounded-2xl border border-indigo-100">
              <div className="flex gap-3 items-center text-indigo-900 font-bold mb-2">
                <Clock className="w-5 h-5" />
                Support Hours
              </div>
              <p className="text-sm text-indigo-700 leading-relaxed">
                Monday – Friday: 9:00 AM – 6:00 PM EST<br />
                Emergency Technical Support: 24/7
              </p>
            </div>
          </div>

          {/* Column 2 & 3: Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-8 md:p-12">
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Full Name</label>
                    <input 
                      type="text" 
                      placeholder="John Doe"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Email Address</label>
                    <input 
                      type="email" 
                      placeholder="john@example.com"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Inquiry Type</label>
                  <select className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition appearance-none bg-white">
                    <option>General Support</option>
                    <option>Doctor Partnership / Integration</option>
                    <option>Media & Press</option>
                    <option>Technical Issue</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Message</label>
                  <textarea 
                    rows={5}
                    placeholder="How can we help you today?"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition resize-none"
                  ></textarea>
                </div>

                <button className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all hover:-translate-y-0.5">
                  Send Message
                </button>

                <p className="text-xs text-center text-slate-400">
                  By submitting this form, you agree to our privacy policy and terms of service regarding medical data handling.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Badges / Global Reach */}
      <section className="py-16 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-center items-center gap-12 grayscale opacity-50">
           <div className="flex items-center gap-2 font-bold text-xl text-slate-400">
             <Globe className="w-6 h-6" /> GLOBAL CARE
           </div>
           <div className="flex items-center gap-2 font-bold text-xl text-slate-400">
             <MessageSquare className="w-6 h-6" /> 24/7 CHAT
           </div>
           <div className="flex items-center gap-2 font-bold text-xl text-slate-400">
             <ShieldAlert className="w-6 h-6" /> HIPAA COMPLIANT
           </div>
        </div>
      </section>
    </div>
  );
}

function ContactInfoItem({ icon, title, content }: { icon: React.ReactNode, title: string, content: string }) {
  return (
    <div className="flex gap-4">
      <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <div>
        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">{title}</div>
        <div className="text-slate-900 font-semibold">{content}</div>
      </div>
    </div>
  );
}

function ShieldAlert(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>
  );
}