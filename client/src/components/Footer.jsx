const Footer = () => {
  return (
    <footer className="border-t border-white/10 bg-slate-950/95 py-16 text-slate-200">
      <div className="mx-auto flex max-w-7xl flex-col gap-12 px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div className="space-y-3">
            <p className="text-xl font-semibold uppercase tracking-[0.24em] text-white">EventIQ</p>
            <p className="max-w-sm text-sm text-slate-400">A polished campus event operations platform for student organizations, clubs, and administrators.</p>
          </div>
          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">Quick links</p>
            <ul className="space-y-3 text-sm text-slate-300">
              <li><a href="/" className="hover:text-white">Home</a></li>
              <li><a href="/events" className="hover:text-white">Events</a></li>
              <li><a href="/clubs" className="hover:text-white">Clubs</a></li>
              <li><a href="/gallery" className="hover:text-white">Gallery</a></li>
            </ul>
          </div>
          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">Resources</p>
            <ul className="space-y-3 text-sm text-slate-300">
              <li><a href="#features" className="hover:text-white">Features</a></li>
              <li><a href="#analytics" className="hover:text-white">Analytics</a></li>
              <li><a href="#pricing" className="hover:text-white">Pricing</a></li>
              <li><a href="#contact" className="hover:text-white">Contact</a></li>
            </ul>
          </div>
          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">Contact</p>
            <div className="space-y-3 text-sm text-slate-300">
              <p>amanminz.cs@gmail.com</p>
              <p>+91 8305399029</p>
              <div className="flex flex-wrap gap-3 pt-2">
                <a href="https://www.instagram.com/amannminz/" target="_blank" rel="noreferrer" className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-300 transition hover:border-brand-primary hover:text-white">Instagram</a>
                <a href="https://linkedin.com/in/amanminz" target="_blank" rel="noreferrer" className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-300 transition hover:border-brand-secondary hover:text-white">LinkedIn</a>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 pt-8 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} EventIQ. Built for campus teams and student organizations.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
