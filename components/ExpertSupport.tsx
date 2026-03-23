import Image from "next/image";

export default function ExpertSupport() {
  return (
    <div className="grid md:grid-cols-3 gap-6">

      {/* Expert Card */}
      <div className="rounded-3xl p-6 bg-gradient-to-br from-pink-100 to-rose-200 flex flex-col justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <Image
            src="/doctor.jpg"
            alt="doctor"
            width={50}
            height={50}
            className="rounded-full"
          />
          <div>
            <p className="font-semibold text-gray-900">
              Dr. Elena Ross
            </p>
            <p className="text-sm text-gray-700">
              Clinical Psychologist
            </p>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Expert Support
          </h3>

          <p className="text-sm text-gray-700 mt-2">
            Connect with trusted professionals anytime.
          </p>

          <button className="mt-4 bg-black text-white px-4 py-2 rounded-xl text-sm hover:opacity-90">
            Connect Now
          </button>
        </div>
      </div>

      {/* Card */}
      <div className="bg-white border rounded-3xl p-6 shadow-sm">
        <h3 className="font-semibold text-gray-900">
          Quiet Journaling
        </h3>
        <p className="text-sm text-gray-600 mt-2">
          Capture your thoughts without distraction.
        </p>
        <div className="mt-6 h-20 bg-gray-100 rounded-xl" />
      </div>

      {/* Card */}
      <div className="bg-white border rounded-3xl p-6 shadow-sm flex items-center justify-center">
        <span className="text-gray-400 text-sm">
          Breathing exercise loading...
        </span>
      </div>

    </div>
  );
}