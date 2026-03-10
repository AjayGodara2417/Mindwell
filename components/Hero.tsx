import Image from "next/image";

export default function Hero() {
  return (
    <section className="w-full bg-[#f3f4f6]">
      <div className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center">
        
        {/* Left Content */}
        <div>
          <h1 className="text-5xl md:text-6xl font-bold leading-tight text-[#0f172a]">
            Find Your <br />
            Balance, <br />
            <span className="text-blue-600">Together.</span>
          </h1>

          <p className="mt-6 text-lg text-gray-600 max-w-xl">
            Empowering patients to manage their mental health and clinicians
            to provide better care with data-driven insights.
          </p>

          {/* Buttons */}
          <div className="mt-8 flex flex-wrap gap-4">
            <button className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold shadow-md hover:bg-blue-700 transition">
              Get Started as a Patient
            </button>

            <button className="bg-gray-200 text-gray-800 px-6 py-3 rounded-xl font-semibold hover:bg-gray-300 transition">
              Join as a Clinician
            </button>
          </div>
        </div>

        {/* Right Image */}
        <div className="relative w-full h-105 rounded-2xl overflow-hidden">
          <Image
            src="/hero-image.jpg"
            alt="Meditation"
            fill
            className="object-cover"
          />
        </div>

      </div>
    </section>
  );
}