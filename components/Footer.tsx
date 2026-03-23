export default function Footer() {
  return (
    <footer className="bg-white border-t mt-20">
      <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">

        <span>© 2026 MindWell. All rights reserved.</span>

        <div className="flex gap-6">
          <span className="hover:text-gray-800 cursor-pointer">Privacy</span>
          <span className="hover:text-gray-800 cursor-pointer">Terms</span>
        </div>

      </div>
    </footer>
  );
}