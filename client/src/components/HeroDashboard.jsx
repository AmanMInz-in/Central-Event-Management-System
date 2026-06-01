import { useEffect } from 'react';
import { motion, useMotionValue, useMotionTemplate } from 'framer-motion';
import { Sparkles, Calendar, Activity, ArrowRight, Zap, ShieldCheck } from 'lucide-react';

const HeroDashboard = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const glowX = useMotionTemplate`${mouseX}px`;
  const glowY = useMotionTemplate`${mouseY}px`;

  const handleMouseMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    mouseX.set((event.clientX - rect.left - rect.width / 2) * 0.12);
    mouseY.set((event.clientY - rect.top - rect.height / 2) * 0.12);
  };

  useEffect(() => {
    const reset = () => {
      mouseX.set(0);
      mouseY.set(0);
    };
    window.addEventListener('mouseout', reset);
    return () => window.removeEventListener('mouseout', reset);
  }, [mouseX, mouseY]);

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      initial={{ opacity: 0, y: 40, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.9, ease: 'easeOut' }}
      className="relative mx-auto flex w-full max-w-[980px] items-center justify-center"
    >
      <div className="pointer-events-none absolute inset-0 rounded-[56px] bg-[radial-gradient(circle_at_center,rgba(79,70,229,0.16),transparent_36%)] blur-3xl" />
      <div className="pointer-events-none absolute left-1/3 top-12 h-44 w-44 rounded-full bg-sky-500/15 blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-24 h-36 w-36 rounded-full bg-violet-500/15 blur-3xl" />
      <div className="pointer-events-none absolute left-8 bottom-20 h-44 w-44 rounded-full bg-cyan-500/15 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.03),transparent_25%,rgba(255,255,255,0.02))] bg-[length:96px_96px] opacity-35" />

      <div className="relative grid gap-6">
        <motion.div
          className="relative overflow-visible"
          whileHover={{ y: -6 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          <div className="absolute right-6 top-0 h-28 w-28 rounded-full border border-white/10 bg-white/5 blur-3xl" />
          <div className="absolute inset-x-0 top-0 h-6 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.16),transparent)]" />

          <div className="relative overflow-hidden rounded-[40px] border border-white/10 bg-slate-900/55 shadow-[0_80px_160px_rgba(15,23,42,0.35)] backdrop-blur-xl">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.14),transparent_25%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.12),transparent_20%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),transparent_45%,rgba(255,255,255,0.03))]" />
            <div className="relative p-6 sm:p-8">
              <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200 backdrop-blur-xl shadow-[0_24px_60px_rgba(15,23,42,0.12)]">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-3xl bg-sky-500/10 text-sky-300 ring-1 ring-sky-400/20">AI</div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Smart operations</p>
                    <p className="text-sm font-semibold text-white">Event automation</p>
                  </div>
                </div>
                <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-emerald-300">Live</span>
              </div>

              <div className="grid gap-5 xl:grid-cols-[1.25fr_0.75fr]">
                <div className="space-y-4 rounded-[32px] bg-white/5 p-5 shadow-[0_35px_80px_rgba(15,23,42,0.18)] backdrop-blur-xl">
                  <div className="flex items-center justify-between gap-4 text-sm text-slate-300">
                    <span className="font-semibold text-white">Event analytics</span>
                    <span className="rounded-full bg-slate-800/80 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-sky-300">Realtime</span>
                  </div>
                  <div className="grid gap-3">
                    <div className="h-2.5 w-full rounded-full bg-white/10">
                      <div className="h-2.5 rounded-full bg-gradient-to-r from-sky-400 via-violet-500 to-fuchsia-400" style={{ width: '82%' }} />
                    </div>
                    <div className="flex items-center justify-between text-sm text-slate-400">
                      <span>Attendees</span>
                      <span className="text-white">4.2K</span>
                    </div>
                    <div className="h-2.5 w-full rounded-full bg-white/10">
                      <div className="h-2.5 rounded-full bg-gradient-to-r from-emerald-400 via-cyan-400 to-sky-500" style={{ width: '67%' }} />
                    </div>
                    <div className="flex items-center justify-between text-sm text-slate-400">
                      <span>Check‑ins</span>
                      <span className="text-white">92%</span>
                    </div>
                  </div>
                </div>
                <div className="rounded-[32px] border border-white/10 bg-slate-900/75 p-5 text-sm text-slate-300 shadow-[0_35px_80px_rgba(15,23,42,0.16)] backdrop-blur-xl">
                  <p className="uppercase tracking-[0.24em] text-slate-500">Live timeline</p>
                  <div className="mt-4 space-y-4">
                    {[
                      { label: '09:00', title: 'Venue open', color: 'bg-sky-400/20 text-sky-300' },
                      { label: '10:30', title: 'Keynote start', color: 'bg-violet-400/20 text-violet-300' },
                      { label: '14:00', title: 'Networking start', color: 'bg-emerald-400/20 text-emerald-300' },
                    ].map((item) => (
                      <div key={item.label} className="rounded-3xl bg-white/5 p-4">
                        <div className="flex items-center justify-between text-sm text-slate-400">
                          <span>{item.label}</span>
                          <span className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase ${item.color}`}>{item.title}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <motion.div
              whileHover={{ y: -4 }}
              className="rounded-[32px] border border-white/10 bg-white/5 p-6 shadow-[0_35px_80px_rgba(15,23,42,0.18)] backdrop-blur-xl"
            >
              <div className="flex items-center justify-between gap-3 text-sm text-slate-300">
                <span className="font-semibold text-white">AI insights</span>
                <span className="rounded-full bg-sky-500/10 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-sky-300">Auto</span>
              </div>
              <p className="mt-4 text-base text-slate-300">Predict peak attendee load, staffing needs, and next best actions across every session.</p>
            </motion.div>
            <motion.div
              whileHover={{ y: -4 }}
              className="rounded-[32px] border border-white/10 bg-white/5 p-6 shadow-[0_35px_80px_rgba(15,23,42,0.18)] backdrop-blur-xl"
            >
              <div className="flex items-center justify-between gap-3 text-sm text-slate-300">
                <span className="font-semibold text-white">Revenue stats</span>
                <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-emerald-300">Forecast</span>
              </div>
              <div className="mt-4 flex items-end justify-between gap-4">
                <div>
                  <p className="text-3xl font-semibold text-white">$1.8M</p>
                  <p className="text-sm text-slate-400">Projected event revenue</p>
                </div>
                <div className="rounded-full bg-slate-800 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-slate-300">+12%</div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default HeroDashboard;
