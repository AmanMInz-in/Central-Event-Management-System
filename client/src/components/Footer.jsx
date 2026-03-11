const Footer = () => {
  return (
    <footer className="mt-20 border-t bg-white py-8 text-slate-700">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div>
            <p className="text-lg font-semibold">Centralized College Event Management System</p>
            <p className="text-sm text-slate-500">Built by Aman Minz</p>
          </div>

          <div className="flex items-center gap-3 text-sm">
            <a href="https://www.instagram.com/amannminz/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-slate-600 transition hover:border-indigo-400 hover:text-indigo-700">
              Instagram
            </a>
            <a href="https://linkedin.com/in/amanminz" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-slate-600 transition hover:border-blue-500 hover:text-blue-700">
              LinkedIn
            </a>
            <a href="https://github.com/AmanMInz-in" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-slate-600 transition hover:border-slate-900 hover:text-slate-900">
              GitHub
            </a>
          </div>
        </div>
        <p className="mt-6 text-center text-xs text-slate-400">© {new Date().getFullYear()} Centralized College Event Management System By Aman Minz. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
