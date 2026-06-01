import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Play, Sparkles, ShieldCheck, Activity } from 'lucide-react';
import HeroDashboard from './HeroDashboard';

const trustBlocks = [
  { label: '10,000+ Events Managed', icon: <Sparkles className="h-4 w-4 text-sky-300" /> },
  { label: '99.9% System Uptime', icon: <ShieldCheck className="h-4 w-4 text-violet-300" /> },
  { label: 'AI-Powered Automation', icon: <Activity className="h-4 w-4 text-emerald-300" /> },
];

const HeroSection = () => (
  <section className="relative min-h-[100vh] w-full overflow-hidden bg-slate-950 text-white">
    <div className="pointer-events-none absolute inset-0 bg-[#020617]" />
    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.16),transparent_26%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.14),transparent_18%)]" />
    <div className="pointer-events-none absolute inset-x-0 top-0 h-[320px] bg-[radial-gradient(circle_at_top_center,rgba(56,189,248,0.18),transparent_30%)]" />
    <div className="pointer-events-none absolute right-16 top-24 h-72 w-72 rounded-full bg-violet-500/12 blur-3xl" />
    <div className="pointer-events-none absolute left-10 top-40 h-56 w-56 rounded-full bg-cyan-500/12 blur-3xl" />
    <div className="pointer-events-none absolute right-0 bottom-16 h-72 w-72 rounded-full bg-slate-400/5 blur-3xl" />
    <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.03),transparent,rgba(255,255,255,0.02))] bg-[length:140px_140px] opacity-30" />

    <div className="relative z-10 mx-auto flex min-h-[calc(100vh-5rem)] max-w-[1440px] flex-col gap-16 px-6 py-20 lg:px-12">
      <div className="grid gap-16 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <motion.div
          initial={{ opacity: 0, x: -80 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.95, ease: 'easeOut' }}
          className="space-y-10"
        >
          <div className="inline-flex items-center gap-3 rounded-full border border-slate-500/40 bg-white/5 px-5 py-3 text-sm text-slate-200 backdrop-blur-xl shadow-[0_20px_60px_rgba(15,23,42,0.15)]">
            <Sparkles className="h-4 w-4 text-sky-300" />
            <span className="font-semibold">AI-powered event intelligence for enterprise teams</span>
          </div>

          <div className="space-y-8">
            <h1 className="display max-w-[720px] text-white">
              Manage Every Event from One Intelligent Platform
            </h1>
            <p className="max-w-xl text-lg leading-8 text-slate-300 sm:text-xl">
              Plan, organize, monitor, and automate event operations with AI-powered insights, real-time analytics, attendee management, and seamless team collaboration.
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <Link
              to="/register"
              className="inline-flex min-w-[220px] items-center justify-center gap-2 rounded-full bg-gradient-to-r from-sky-400 to-violet-500 px-7 py-4 text-base font-semibold text-white shadow-[0_35px_120px_rgba(56,189,248,0.3)] transition hover:-translate-y-0.5 hover:shadow-[0_40px_140px_rgba(56,189,248,0.32)]"
            >
              Get Started Free
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="#features"
              className="inline-flex min-w-[220px] items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-7 py-4 text-base font-semibold text-slate-100 transition hover:border-sky-300/40 hover:text-white"
            >
              <Play className="h-4 w-4 text-slate-100" />
              Watch Demo
            </a>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {trustBlocks.map((item) => (
              <motion.div
                key={item.label}
                whileHover={{ y: -3 }}
                className="rounded-[28px] border border-white/10 bg-white/5 p-5 text-sm text-slate-200 backdrop-blur-xl shadow-[0_24px_60px_rgba(15,23,42,0.18)]"
              >
                <div className="flex items-center gap-3">{item.icon}<span>{item.label}</span></div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <div className="relative">
          <HeroDashboard />
        </div>
      </div>
    </div>
  </section>
);

export default HeroSection;
