import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import EventList from '../components/EventList';
import HeroSection from '../components/HeroSection';
import { 
  Sparkles, 
  Calendar, 
  Users, 
  MapPin, 
  ArrowRight,
  Zap,
  TrendingUp,
  Bell
} from 'lucide-react';

const groupBy = (events, state) => events.filter((e) => e.status === state);

const Home = () => {
  const [events, setEvents] = useState([]);
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ clubs: 0, participants: 0 });

  useEffect(() => {
    const fetch = async () => {
      try {
        const [eventsRes, noticesRes] = await Promise.all([
          api.get('/events'),
          api.get('/notices'),
        ]);
        setEvents(eventsRes.data || []);
        setNotices(noticesRes.data || []);
        
        setStats({
          clubs: Math.ceil(eventsRes.data?.length / 3) || 0,
          participants: (eventsRes.data?.length || 0) * 15,
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const upcomingEvents = groupBy(events, 'upcoming').slice(0, 3);
  const allUpcoming = groupBy(events, 'upcoming');
  const allOngoing = groupBy(events, 'ongoing');
  const allPast = groupBy(events, 'past');

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary mx-auto mb-4"></div>
          <p className="text-slate-600">Loading amazing events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <HeroSection />

      {/* Analytics Showcase Section */}
      <section className="py-20 bg-slate-950/95">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-12">
            <p className="mb-4 inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200">Smart Operations</p>
            <h2 className="section-title">Event Automation & Analytics</h2>
          </div>
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Left Column: Live Analytics */}
            <div className="lg:col-span-2 space-y-6">
              <div className="glass-panel">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-sm uppercase tracking-[0.22em] text-slate-400">Event Analytics</p>
                    <h3 className="text-2xl font-bold text-white mt-2">Realtime Metrics</h3>
                  </div>
                  <span className="badge badge-success">LIVE</span>
                </div>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2 text-sm">
                      <span className="text-slate-300">Total Registrations</span>
                      <span className="text-brand-primary font-bold">{stats.participants.toLocaleString()}</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/10">
                      <div className="h-2 rounded-full bg-brand-primary" style={{ width: '100%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2 text-sm">
                      <span className="text-slate-300">Check-in Rate</span>
                      <span className="text-emerald-400 font-bold">{Math.round((stats.participants * 0.85))}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/10">
                      <div className="h-2 rounded-full bg-emerald-400" style={{ width: '85%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2 text-sm">
                      <span className="text-slate-300">Engagement Score</span>
                      <span className="text-amber-400 font-bold">92%</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/10">
                      <div className="h-2 rounded-full bg-amber-400" style={{ width: '92%' }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Live Timeline */}
              <div className="glass-panel">
                <div className="flex items-center justify-between mb-6">
                  <p className="text-sm uppercase tracking-[0.22em] text-slate-400">Live Timeline</p>
                  <span className="text-xs text-slate-500">Today's Events</span>
                </div>
                <div className="space-y-3">
                  {allUpcoming.slice(0, 3).map((event, idx) => (
                    <div key={event._id} className="flex items-center gap-4 p-3 rounded-lg bg-slate-900/50 border border-white/5">
                      <div className="text-center min-w-16">
                        <p className="text-sm font-bold text-brand-primary">{event.time}</p>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white truncate">{event.title}</p>
                        <p className="text-xs text-slate-400">{event.venue}</p>
                      </div>
                      <span className="badge badge-secondary text-xs">{event.club}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Insights */}
            <div className="space-y-6">
              <div className="glass-panel">
                <div className="flex items-center justify-between mb-6">
                  <p className="text-sm uppercase tracking-[0.22em] text-slate-400">AI Insights</p>
                  <span className="text-xs px-2 py-1 rounded-full bg-brand-primary/10 text-brand-primary font-semibold">AUTO</span>
                </div>
                <p className="text-sm text-slate-300 leading-6">
                  Peak attendance expected at <span className="text-white font-semibold">{allUpcoming[0]?.title || 'upcoming events'}</span>. Recommend {Math.ceil((stats.participants * 0.15) / allUpcoming.length)} staff members per event for optimal crowd management.
                </p>
              </div>

              <div className="glass-panel">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm uppercase tracking-[0.22em] text-slate-400">Impact Forecast</p>
                  <span className="text-xs px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold">+{Math.floor(Math.random() * 15) + 8}%</span>
                </div>
                <p className="text-4xl font-bold text-white">${(events.length * 45000 / 1000000).toFixed(1)}M</p>
                <p className="text-xs text-slate-400 mt-2">Projected event impact across campus</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="py-20 bg-slate-950/80">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-16 text-center">
            <p className="mb-4 inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200">Trusted by student organizations and campus leaders</p>
            <h2 className="section-title">Why Choose EventIQ?</h2>
            <p className="section-subtitle mx-auto mt-4">Manage events, clubs, and attendees with a polished platform built for campus operations and real-time coordination.</p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                title: 'Unified Event Management',
                description: 'Centralize event creation, attendee registration, approvals, and post-event reporting in one polished workflow.',
              },
              {
                title: 'Real-Time Insights',
                description: 'Track attendance, engagement, and operational status across every activity with clear dashboards and alerts.',
              },
              {
                title: 'Clubs & Communities',
                description: 'Empower campus organizations with role-based access, club management, and trusted collaboration tools.',
              },
            ].map((feature) => (
              <div key={feature.title} className="card p-8">
                <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
                <p className="mt-4 text-slate-300 leading-7">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Notices Section */}
      {notices.length > 0 && (
        <section className="py-16">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex items-center gap-3 mb-8">
              <Bell className="w-6 h-6 text-brand-primary" />
              <h2 className="text-3xl font-bold text-white">Latest Announcements</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {notices.slice(0, 2).map((note) => (
                <div key={note._id} className="card p-6">
                  <h3 className="text-xl font-semibold text-white mb-2">{note.title}</h3>
                  <p className="text-slate-300 mb-4 line-clamp-2">{note.content}</p>
                  <p className="text-xs text-slate-500">Posted by {note.createdBy?.name || 'Admin'} on {new Date(note.createdAt).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Upcoming Events Preview */}
      {upcomingEvents.length > 0 && (
        <section className="py-16 bg-slate-950/80">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-3xl md:text-4xl font-bold text-white">Featured Upcoming Events</h2>
              {allUpcoming.length > 3 && (
                <Link to="/events" className="inline-flex items-center gap-2 text-brand-primary font-semibold hover:gap-4 transition-all">
                  View All <ArrowRight className="w-5 h-5" />
                </Link>
              )}
            </div>
            <div className="card p-6">
              <EventList events={upcomingEvents} />
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      {allUpcoming.length > 0 && (
        <section className="py-16 relative overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-r from-brand-primary/95 to-brand-secondary/95"></div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-white opacity-10 rounded-full translate-y-1/2 -translate-x-1/2"></div>
          </div>
          
          <div className="relative z-10 max-w-6xl mx-auto px-4 text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Explore More?
            </h2>
            <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
              Browse all {allUpcoming.length} upcoming events and find the perfect one for you.
            </p>
            <Link
              to="/events"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-brand-primary font-semibold rounded-lg hover:bg-slate-100 transition-all duration-300"
            >
              See All Events
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>
      )}

      {/* Events by Status */}
      <section className="py-16 bg-slate-950/80">
        <div className="max-w-6xl mx-auto px-4">
          <div className="space-y-16">
            {allOngoing.length > 0 && (
              <div>
                <h2 className="text-3xl font-bold mb-8 text-slate-900 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  Ongoing Events
                </h2>
                <EventList events={allOngoing} />
              </div>
            )}

            {allPast.length > 0 && (
              <div>
                <h2 className="text-3xl font-bold mb-8 text-white">Past Events</h2>
                <EventList events={allPast.slice(0, 3)} />
                {allPast.length > 3 && (
                  <div className="text-center mt-8">
                    <Link to="/events" className="inline-flex items-center gap-2 text-brand-primary font-semibold">
                      View all past events <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
