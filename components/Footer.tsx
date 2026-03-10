import Link from "next/link";
import { Share2, AtSign } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#f3f4f6] border-t">
      <div className="max-w-7xl mx-auto px-6 py-16">

        {/* Top Section */}
        <div className="grid md:grid-cols-4 gap-10">

          {/* Logo + Description */}
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-100">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="text-blue-600"
                >
                  <path d="M12 2C9 6 5 7 5 12c0 4 3 7 7 10 4-3 7-6 7-10 0-5-4-6-7-10z" />
                </svg>
              </div>
              <span className="text-lg text-mist-800 font-semibold">MindWell</span>
            </div>

            <p className="mt-4 text-gray-600 max-w-xs">
              Improving mental health outcomes through technology and
              connection.
            </p>
          </div>

          {/* Platform */}
          <div>
            <h4 className="font-semibold tracking-wider text-sm mb-4 text-gray-900">
              PLATFORM
            </h4>

            <div className="flex flex-col gap-3 text-gray-600">
              <Link href="#">For Patients</Link>
              <Link href="#">For Clinicians</Link>
              <Link href="#">Pricing</Link>
            </div>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold tracking-wider text-sm mb-4 text-gray-900">
              COMPANY
            </h4>

            <div className="flex flex-col gap-3 text-gray-600">
              <Link href="#">About</Link>
              <Link href="#">Contact</Link>
              <Link href="#">Privacy</Link>
            </div>
          </div>

          {/* Connect */}
          <div>
            <h4 className="font-semibold tracking-wider text-sm mb-4 text-gray-900">
              CONNECT
            </h4>

            <div className="flex gap-4 text-gray-500">
              <Share2 className="cursor-pointer hover:text-blue-600" />
              <AtSign className="cursor-pointer hover:text-blue-600" />
            </div>
          </div>

        </div>

        {/* Divider */}
        <div className="border-t mt-12 pt-6 text-center text-gray-500 text-sm">
          © 2024 MindWell Technologies Inc. All rights reserved.
        </div>

      </div>
    </footer>
  );
}