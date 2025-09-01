import React, { useState } from "react";
import { Link } from "react-router-dom";

/**
 * HomePage (Landing)
 * TailwindCSS-based responsive landing page for Report2Clean
 * - Showcases: reporting, tracking, AI insights, location-based notifications
 * - Ready for dark mode (if 'dark' class applied at root)
 * - Modular sections; you can lift out components later
 */

function HomePage() {
  return (
    <div className="flex flex-col min-h-screen relative bg-gradient-to-br from-slate-50 via-white to-teal-50/30 text-slate-800 dark:bg-gradient-to-br dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 dark:text-slate-100">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-gradient-to-br from-teal-100/40 to-emerald-200/30 dark:from-teal-900/20 dark:to-emerald-800/10 animate-pulse" />
        <div className="absolute top-1/3 -left-32 w-64 h-64 rounded-full bg-gradient-to-br from-amber-100/30 to-orange-200/20 dark:from-amber-900/10 dark:to-orange-800/5 animate-pulse delay-1000" />
        <div className="absolute bottom-20 right-1/4 w-48 h-48 rounded-full bg-gradient-to-br from-cyan-100/40 to-teal-200/30 dark:from-cyan-900/15 dark:to-teal-800/10 animate-pulse delay-2000" />
        <div className="absolute bottom-1/3 left-1/4 w-32 h-32 rounded-full bg-gradient-to-br from-emerald-100/50 to-green-200/40 dark:from-emerald-900/20 dark:to-green-800/15 animate-pulse delay-3000" />
      </div>

      {/* Mesh Gradient Overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-30 dark:opacity-20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(45,212,191,0.15),transparent_40%),radial-gradient(ellipse_at_bottom_right,rgba(16,185,129,0.1),transparent_40%),radial-gradient(ellipse_at_top_right,rgba(245,158,11,0.08),transparent_50%)]" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Hero */}
        <HeroSection />

        {/* Stats */}
        <StatsBar />

        {/* Features */}
        <FeaturesSection />

        {/* How It Works */}
        <HowItWorks />

        {/* Map Preview */}
        <MapPreview />

        {/* AI + Location Recommendation Highlight */}
        <IntelligenceHighlight />

        {/* Testimonials */}
        <Testimonials />

        {/* Authorities / Partners */}
        <AuthoritiesSection />

        {/* FAQ */}
        <FAQSection />

        {/* Final Call To Action */}
        <FinalCTA />

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}

/* --------------------------------- Sections -------------------------------- */

function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <BackgroundDecor />
      <div className="relative z-10 px-6 pt-24 pb-32 mx-auto max-w-7xl md:px-10 lg:px-16">
        <div className="flex flex-col items-center text-center">
          <span className="inline-flex items-center gap-2 px-4 py-1 mb-6 text-sm font-medium rounded-full bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-200 shadow-sm">
            <span className="w-2 h-2 rounded-full animate-pulse bg-teal-500" />
            Community Driven • Real-Time Cleanliness
          </span>
          <h1 className="max-w-4xl text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white md:text-6xl leading-tight">
            Report. Track. Improve. <span className="text-teal-600 dark:text-teal-400">Make Your City Cleaner</span>
          </h1>
          <p className="max-w-2xl mt-6 text-lg md:text-xl text-slate-600 dark:text-slate-300">
            Report unhygienic conditions & infrastructure issues. Nearby residents and authorities
            get alerted instantly. AI prioritizes impact. Join a data-driven movement for cleaner,
            healthier streets.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 mt-10">
            <PrimaryLink to="/report">Submit a Report</PrimaryLink>
            <SecondaryLink to="/reports">Explore Reports</SecondaryLink>
            <GhostLink to="/map">Live Map</GhostLink>
          </div>
          <p className="mt-6 text-sm text-slate-500 dark:text-slate-400">
            No account? <Link to="/register" className="font-semibold text-teal-600 dark:text-teal-400 hover:underline">Register now</Link>
          </p>
        </div>
      </div>
      {/* Decorative bottom wave */}
      <div className="w-full h-16 -mt-16 bg-gradient-to-b from-transparent to-white dark:to-slate-900" />
    </section>
  );
}

function StatsBar() {
  const stats = [
    { label: "Reports Submitted", value: "12,840" },
    { label: "Resolved Issues", value: "8,973" },
    { label: "Active Citizens", value: "4,120" },
    { label: "Areas Covered", value: "37" },
  ];
  return (
    <section className="relative bg-gradient-to-r from-slate-50 via-white to-slate-50 dark:bg-gradient-to-r dark:from-slate-800/50 dark:via-slate-800/30 dark:to-slate-800/50 border-y border-slate-200/50 dark:border-slate-700/50">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-30 dark:opacity-20">
        <div className="w-full h-full bg-[linear-gradient(90deg,rgba(45,212,191,0.05)_0%,transparent_50%,rgba(45,212,191,0.05)_100%)]" />
      </div>
      
      {/* Subtle animation bars */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-teal-200/40 to-transparent dark:via-teal-600/20 animate-pulse" />
        <div className="absolute top-0 left-1/2 w-px h-full bg-gradient-to-b from-transparent via-emerald-200/40 to-transparent dark:via-emerald-600/20 animate-pulse delay-500" />
        <div className="absolute top-0 left-3/4 w-px h-full bg-gradient-to-b from-transparent via-teal-200/40 to-transparent dark:via-teal-600/20 animate-pulse delay-1000" />
      </div>

      <div className="relative grid grid-cols-2 gap-6 px-6 py-10 mx-auto max-w-6xl md:grid-cols-4 md:gap-0">
        {stats.map((s, index) => (
          <div key={s.label} className="flex flex-col items-center justify-center group">
            <span className="text-2xl font-bold text-slate-900 dark:text-white md:text-3xl group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors duration-300">{s.value}</span>
            <span className="mt-2 text-xs font-medium tracking-wide uppercase text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors duration-300">
              {s.label}
            </span>
            {/* Decorative dot */}
            <div className="mt-3 w-1 h-1 rounded-full bg-teal-400/60 dark:bg-teal-500/60 group-hover:bg-teal-500 dark:group-hover:bg-teal-400 transition-colors duration-300" />
          </div>
        ))}
      </div>
    </section>
  );
}

function FeaturesSection() {
  const features = [
    {
      title: "Report Instantly",
      desc: "Upload photos, videos & location with one tap. Geo-tagging ensures accuracy.",
      icon: ReportIcon,
    },
    {
      title: "Real-Time Alerts",
      desc: "Nearby residents & subscribed authorities get immediate notifications.",
      icon: BellIcon,
    },
    {
      title: "Progress Tracking",
      desc: "Track each report’s lifecycle: submitted → verified → assigned → resolved.",
      icon: TrackIcon,
    },
    {
      title: "AI Prioritization",
      desc: "AI models rank urgency & recommend response actions to city workers.",
      icon: AIIcon,
    },
    {
      title: "Location-Based Suggestions",
      desc: "See hotspots near you & get proactive prevention recommendations.",
      icon: LocationIcon,
    },
    {
      title: "Community Rewards",
      desc: "Earn reputation & badges for consistent, high-quality reporting.",
      icon: RewardIcon,
    },
  ];
  return (
    <section className="relative px-6 py-24 mx-auto max-w-7xl md:px-10 lg:px-16">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-32 h-32 rounded-full bg-gradient-to-br from-teal-100/20 to-emerald-200/15 dark:from-teal-900/10 dark:to-emerald-800/8 animate-pulse delay-1000" />
        <div className="absolute bottom-32 left-16 w-24 h-24 rounded-full bg-gradient-to-br from-cyan-100/25 to-teal-200/20 dark:from-cyan-900/12 dark:to-teal-800/10 animate-pulse delay-2000" />
        <div className="absolute top-1/2 left-8 w-16 h-16 rounded-full bg-gradient-to-br from-emerald-100/30 to-green-200/25 dark:from-emerald-900/15 dark:to-green-800/12 animate-pulse" />
      </div>

      <div className="relative text-center">
        <h2 className="text-3xl font-bold md:text-4xl">
          Key Capabilities of <span className="text-teal-600 dark:text-teal-400">Report2Clean</span>
        </h2>
        <p className="max-w-2xl mx-auto mt-4 text-slate-600 dark:text-slate-300">
            Empowering citizens & authorities with data, visibility, and automation to drive cleaner environments.
        </p>
      </div>
      <div className="relative grid gap-8 mt-16 sm:grid-cols-2 lg:grid-cols-3">
        {features.map(({ title, desc, icon: Icon }) => (
          <div
            key={title}
            className="relative group rounded-xl border border-slate-200/60 dark:border-slate-700/60 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-sm hover:shadow-xl transition-all duration-300 p-6 overflow-hidden"
          >
            <div className="absolute inset-0 transition-opacity opacity-0 pointer-events-none bg-gradient-to-br from-teal-50/80 to-amber-50/60 dark:from-teal-900/20 dark:to-amber-900/15 group-hover:opacity-100" />
            <div className="relative flex items-start gap-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-teal-100 to-teal-200 text-teal-700 dark:from-teal-900/60 dark:to-teal-800/40 dark:text-teal-300 ring-1 ring-teal-200/60 dark:ring-teal-700/60 shadow-sm">
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  {desc}
                </p>
              </div>
            </div>
            <div className="mt-6">
              <Link
                to="/report"
                className="inline-flex items-center text-sm font-medium text-teal-600 dark:text-teal-400 hover:underline group-hover:text-teal-700 dark:group-hover:text-teal-300 transition-colors"
              >
                Learn more →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    {
      step: 1,
      title: "Capture Issue",
      text: "Take a photo or short video and auto-detect location with GPS.",
    },
    {
      step: 2,
      title: "AI Classification",
      text: "AI suggests category & severity — you confirm or adjust.",
    },
    {
      step: 3,
      title: "Broadcast & Notify",
      text: "Nearby citizens & responsible authorities get real-time alerts.",
    },
    {
      step: 4,
      title: "Track & Resolve",
      text: "Monitor resolution status; receive closure confirmation & impact metrics.",
    },
  ];
  return (
    <section className="relative bg-gradient-to-b from-slate-50 to-white dark:from-slate-800 dark:to-slate-900">
      <div className="px-6 py-24 mx-auto max-w-6xl md:px-10">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-bold md:text-4xl">
              How <span className="text-teal-600 dark:text-teal-400">It Works</span>
            </h2>
            <p className="mt-4 text-slate-600 dark:text-slate-300">
              We reduce friction so citizens can engage effortlessly while delivering structured
              data for authorities to act faster and smarter.
            </p>
            <ul className="mt-10 space-y-6">
              {steps.map((s) => (
                <li key={s.step} className="flex gap-4">
                  <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 font-semibold rounded-full bg-teal-600 text-white shadow-md">
                    {s.step}
                  </div>
                  <div>
                    <h3 className="font-semibold">{s.title}</h3>
                    <p className="text-sm mt-1 text-slate-600 dark:text-slate-300 leading-relaxed">{s.text}</p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-4 mt-10">
              <PrimaryLink to="/report">Start Reporting</PrimaryLink>
              <SecondaryLink to="/register">Join the Community</SecondaryLink>
            </div>
          </div>
          <div className="relative">
            <div className="p-4 rounded-2xl bg-white/70 dark:bg-slate-800/70 backdrop-blur border border-slate-200 dark:border-slate-700 shadow-xl">
              <div className="aspect-[4/3] rounded-xl bg-gradient-to-br from-teal-500/20 via-emerald-400/10 to-amber-400/20 dark:from-teal-400/10 dark:via-emerald-400/5 dark:to-amber-400/10 flex items-center justify-center">
                <span className="px-4 py-2 text-sm font-medium tracking-wide text-center text-teal-800 bg-white rounded-md shadow-md dark:text-teal-200 dark:bg-slate-900/60 ring-1 ring-slate-200 dark:ring-slate-700">
                  Interactive Workflow Preview (Insert App Screenshot / Animation)
                </span>
              </div>
              <p className="mt-4 text-xs text-center text-slate-500 dark:text-slate-400">
                Replace this card with screenshots of the reporting flow.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function MapPreview() {
  return (
    <section className="px-6 py-24 mx-auto max-w-7xl md:px-10 lg:px-16">
      <div className="grid gap-10 lg:grid-cols-2">
        <div className="flex flex-col justify-center">
          <h2 className="text-3xl font-bold md:text-4xl">
            Live <span className="text-teal-600 dark:text-teal-400">Geo-Map</span> of Reports
          </h2>
            <p className="mt-4 text-slate-600 dark:text-slate-300">
              Visualize clusters, severity levels, and resolution progress. AI surfaces hotspots and
              recommends preventive actions before escalation.
            </p>
          <ul className="mt-6 space-y-3 text-sm text-slate-600 dark:text-slate-300">
            <li className="flex items-start gap-2">
              <Bullet /> Heatmaps highlight recurring problem zones.
            </li>
            <li className="flex items-start gap-2">
              <Bullet /> Filter by status, category, severity, or time window.
            </li>
            <li className="flex items-start gap-2">
              <Bullet /> Nearby watchers auto-subscribed for critical alerts.
            </li>
            <li className="flex items-start gap-2">
              <Bullet /> Export data for policy planning & sanitation audits.
            </li>
          </ul>
          <div className="flex flex-wrap gap-4 mt-8">
            <PrimaryLink to="/map">Open Interactive Map</PrimaryLink>
            <GhostLink to="/location">Share Location</GhostLink>
          </div>
        </div>
        <div className="relative">
          <div className="overflow-hidden border rounded-2xl border-slate-200 dark:border-slate-700 shadow-xl">
            <iframe
              title="Live Map"
              className="w-full h-[380px]"
              loading="lazy"
              src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d3532.812046368325!2d87.27056361453339!3d26.45247419650686!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2snp!4v1712922890925!5m2!1sen!2snp"
            />
          </div>
          <p className="mt-3 text-xs text-center text-slate-500 dark:text-slate-400">
            Embed a dynamic map component here (Leaflet / Mapbox / Google Maps API).
          </p>
        </div>
      </div>
    </section>
  );
}

function IntelligenceHighlight() {
  return (
    <section className="relative px-6 py-24 overflow-hidden bg-gradient-to-br from-teal-700 via-teal-600 to-emerald-600 dark:from-teal-800 dark:via-teal-700 dark:to-emerald-700">
      <Noise />
      <div className="relative max-w-5xl mx-auto text-center text-teal-50">
        <h2 className="text-3xl font-bold md:text-4xl">
          AI + Location Intelligence for Faster Action
        </h2>
        <p className="max-w-3xl mx-auto mt-4 text-teal-100/90">
          Our models rank severity, recommend response prioritization, detect duplicates, and push
          predictions about emerging waste hotspots—so interventions can be proactive, not reactive.
        </p>
        <div className="grid max-w-4xl gap-6 mx-auto mt-12 md:grid-cols-3">
          {[
            { t: "Severity Scoring", d: "Machine vision + metadata to grade urgency & health risk." },
            { t: "Hotspot Forecasts", d: "Time-series patterns predict future sanitation pressure points." },
            { t: "Smart Routing", d: "Suggests optimized cleanup task assignments for teams." },
          ].map((c) => (
            <div
              key={c.t}
              className="p-5 rounded-xl bg-white/10 backdrop-blur border border-white/20 shadow-sm"
            >
              <h3 className="font-semibold">{c.t}</h3>
              <p className="mt-2 text-sm text-teal-100/80">{c.d}</p>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap justify-center gap-4 mt-12">
          <SecondaryLink to="/register" invert>
            Join Early Access
          </SecondaryLink>
          <GhostLink to="/dashboard" invert>
            View Analytics
          </GhostLink>
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  const items = [
    {
      quote:
        "We resolve complaints 40% faster because citizens provide precise location & evidence. It’s transforming sanitation planning.",
      author: "Municipal Operations Lead",
      tag: "Biratnagar Ward 5",
    },
    {
      quote:
        "I submitted a clogged drain report and within hours the neighbors and ward office were notified. It got fixed the same day.",
      author: "Local Resident",
      tag: "Community Reporter",
    },
    {
      quote:
        "The AI prioritization helps us allocate limited teams more effectively. We finally have clarity on high-impact areas.",
      author: "Sanitation Supervisor",
      tag: "Public Works",
    },
  ];
  return (
    <section className="px-6 py-24 mx-auto max-w-6xl md:px-10">
      <div className="text-center">
        <h2 className="text-3xl font-bold md:text-4xl">
          Real Impact for <span className="text-teal-600 dark:text-teal-400">Communities</span>
        </h2>
        <p className="max-w-2xl mx-auto mt-4 text-slate-600 dark:text-slate-300">
          Trusted by residents, volunteers, and municipal teams working toward cleaner, safer
          neighborhoods.
        </p>
      </div>
      <div className="grid gap-8 mt-16 md:grid-cols-2 lg:grid-cols-3">
        {items.map((t) => (
          <blockquote
            key={t.author}
            className="relative p-6 rounded-xl bg-white dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 shadow-sm"
          >
            <span className="absolute text-6xl font-serif -top-6 left-4 text-teal-500/20 select-none">
              “
            </span>
            <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              {t.quote}
            </p>
            <footer className="mt-4">
              <div className="font-semibold">{t.author}</div>
              <div className="text-xs text-teal-600 dark:text-teal-400">{t.tag}</div>
            </footer>
          </blockquote>
        ))}
      </div>
    </section>
  );
}

function AuthoritiesSection() {
  return (
    <section className="px-6 py-24 mx-auto max-w-7xl md:px-10 lg:px-16">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <div>
          <h2 className="text-3xl font-bold md:text-4xl">
            Tools for <span className="text-teal-600 dark:text-teal-400">Authorities & NGOs</span>
          </h2>
          <p className="mt-4 text-slate-600 dark:text-slate-300">
            Municipal dashboards & API access deliver actionable intelligence: resource allocation,
            trend detection, policy feedback loops, and operational benchmarking.
          </p>
          <ul className="mt-6 space-y-3 text-sm text-slate-600 dark:text-slate-300">
            <li className="flex gap-2">
              <Bullet /> Role-based dashboards & resolution pipelines
            </li>
            <li className="flex gap-2">
              <Bullet /> Exportable analytics & compliance reports
            </li>
            <li className="flex gap-2">
              <Bullet /> Integration-ready (webhooks + REST APIs)
            </li>
            <li className="flex gap-2">
              <Bullet /> Machine learning risk heatmaps
            </li>
          </ul>
          <div className="flex flex-wrap gap-4 mt-8">
            <PrimaryLink to="/dashboard">View Dashboard</PrimaryLink>
            <SecondaryLink to="/register">Partner With Us</SecondaryLink>
          </div>
        </div>
        <div className="relative">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 shadow-xl">
            <div className="aspect-[4/3] flex items-center justify-center rounded-lg bg-gradient-to-tr from-emerald-500/10 via-teal-500/10 to-amber-400/10 dark:from-emerald-400/10 dark:via-teal-400/10 dark:to-amber-500/10">
              <span className="px-4 py-2 text-sm text-center rounded-md bg-white/70 dark:bg-slate-900/50 ring-1 ring-slate-200 dark:ring-slate-700">
                Placeholder: Authority Dashboard KPIs / Chart Suite
              </span>
            </div>
            <p className="mt-3 text-xs text-center text-slate-500 dark:text-slate-400">
              Replace with live charts (e.g., Recharts, ECharts, or custom).
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function FAQSection() {
  const questions = [
    {
      q: "Do I need an account to submit a report?",
      a: "You can view public reports without an account, but creating and tracking your own reports or receiving alerts requires registration.",
    },
    {
      q: "How are nearby notifications triggered?",
      a: "We calculate a geofence radius around the report location and notify opted-in users within that boundary in real time.",
    },
    {
      q: "What powers the AI prioritization?",
      a: "A combination of image classification, NLP on descriptions, historical resolution times, and geographic context models.",
    },
    {
      q: "Is my personal data secure?",
      a: "Yes. We store only essential metadata and follow modern encryption & access control practices.",
    },
  ];
  return (
    <section className="px-6 py-24 mx-auto max-w-4xl md:px-10">
      <h2 className="text-3xl font-bold text-center md:text-4xl">
        Frequently <span className="text-teal-600 dark:text-teal-400">Asked Questions</span>
      </h2>
      <div className="mt-12 space-y-4">
        {questions.map((item, i) => (
          <FAQItem key={i} {...item} defaultOpen={i === 0} />
        ))}
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="relative px-6 py-24 overflow-hidden">
      <BackgroundDecor subtle />
      <div className="relative max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold md:text-4xl">
          Ready to <span className="text-teal-600 dark:text-teal-400">Take Action?</span>
        </h2>
        <p className="max-w-2xl mx-auto mt-4 text-slate-600 dark:text-slate-300">
          Join thousands improving public health & urban hygiene. Your report can drive change
          today.
        </p>
        <div className="flex flex-wrap justify-center gap-4 mt-10">
          <PrimaryLink to="/report">Submit Your First Report</PrimaryLink>
          <SecondaryLink to="/register">Create Account</SecondaryLink>
          <GhostLink to="/reports">Browse Reports</GhostLink>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="px-6 py-16 mt-auto border-t bg-slate-50 dark:bg-slate-900 dark:border-slate-800">
      <div className="grid gap-10 mx-auto max-w-7xl md:grid-cols-4">
        <div className="space-y-3">
          <h3 className="text-lg font-bold">Report2Clean</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            A collaborative platform accelerating environmental cleanliness through data,
            technology & community power.
          </p>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Platform
          </h4>
          <ul className="space-y-2 text-sm">
            <FooterLink to="/report">Submit Report</FooterLink>
            <FooterLink to="/map">Live Map</FooterLink>
            <FooterLink to="/reports">All Reports</FooterLink>
            <FooterLink to="/dashboard">Dashboard</FooterLink>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Resources
          </h4>
          <ul className="space-y-2 text-sm">
            <FooterLink to="/register">Get Started</FooterLink>
            <FooterLink to="/login">Login</FooterLink>
            <FooterLink to="/profile">Profile</FooterLink>
            <FooterLink to="/location">Location Picker</FooterLink>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Stay Updated
          </h4>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Subscribe for alerts & impact summaries (implement form).
          </p>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex mt-4 rounded-lg overflow-hidden border border-slate-300 focus-within:ring-2 focus-within:ring-teal-500 dark:border-slate-600"
          >
            <input
              type="email"
              placeholder="Email"
              className="px-3 py-2 text-sm bg-white outline-none dark:bg-slate-800 flex-1"
            />
            <button
              className="px-4 text-sm font-medium bg-teal-600 text-white hover:bg-teal-700 transition"
              type="submit"
            >
              Join
            </button>
          </form>
        </div>
      </div>
      <div className="pt-10 mt-10 text-xs text-center border-t border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
        © {new Date().getFullYear()} Report2Clean. All rights reserved. Built for cleaner cities.
      </div>
    </footer>
  );
}

/* --------------------------------- Utilities -------------------------------- */

function FAQItem({ q, a, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border rounded-lg border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/60">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center justify-between w-full px-4 py-4 text-left"
      >
        <span className="font-medium">{q}</span>
        <span
          className={`ml-4 transform transition-transform ${
            open ? "rotate-180" : ""
          } text-teal-600 dark:text-teal-400`}
        >
          ▼
        </span>
      </button>
      {open && (
        <div className="px-4 pb-5 -mt-1 text-sm text-slate-600 dark:text-slate-300">
          {a}
        </div>
      )}
    </div>
  );
}

function PrimaryLink({ to, children }) {
  return (
    <Link
      to={to}
      className="inline-flex items-center px-6 py-3 text-sm font-semibold text-white rounded-lg shadow-md bg-teal-600 hover:bg-teal-700 focus:outline-none focus-visible:ring-2 ring-offset-2 ring-teal-500 dark:ring-offset-slate-900 transition"
    >
      {children}
    </Link>
  );
}

function SecondaryLink({ to, children, invert = false }) {
  const base =
    "inline-flex items-center px-6 py-3 text-sm font-semibold rounded-lg border transition focus:outline-none focus-visible:ring-2 ring-offset-2";
  const normal =
    "border-teal-600 text-teal-700 hover:bg-teal-50 dark:text-teal-300 dark:border-teal-400 dark:hover:bg-teal-900/30 ring-teal-500 dark:ring-offset-slate-900";
  const inverted =
    "border-white text-white hover:bg-white/10 ring-white ring-offset-teal-700/0";
  return (
    <Link to={to} className={`${base} ${invert ? inverted : normal}`}>
      {children}
    </Link>
  );
}

function GhostLink({ to, children, invert = false }) {
  const base =
    "inline-flex items-center px-5 py-2.5 text-sm font-medium rounded-lg transition focus:outline-none focus-visible:ring-2 ring-offset-2";
  const normal =
    "text-slate-700 hover:bg-slate-100 ring-teal-500 dark:text-slate-200 dark:hover:bg-slate-800/70 dark:ring-offset-slate-900";
  const inverted =
    "text-white/90 hover:bg-white/10 ring-white ring-offset-teal-700/0";
  return (
    <Link to={to} className={`${base} ${invert ? inverted : normal}`}>
      {children}
    </Link>
  );
}

function FooterLink({ to, children }) {
  return (
    <li>
      <Link
        to={to}
        className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
      >
        {children}
      </Link>
    </li>
  );
}

function Bullet() {
  return (
    <span className="w-2 h-2 mt-1 rounded-full bg-teal-500 dark:bg-teal-400 flex-shrink-0" />
  );
}

function BackgroundDecor({ subtle = false }) {
  return (
    <div
      className={`absolute inset-0 -z-10 ${
        subtle
          ? "bg-gradient-to-br from-teal-50/50 via-transparent to-emerald-50/30 dark:from-teal-900/10 dark:via-transparent dark:to-emerald-900/5"
          : "bg-gradient-to-br from-teal-50/80 via-transparent to-emerald-100/60 dark:from-teal-900/20 dark:via-transparent dark:to-emerald-900/15"
      }`}
    >
      {/* Radial gradients for depth */}
      <div className="absolute inset-0 opacity-60 dark:opacity-30">
        <div className="absolute top-20 left-1/4 w-96 h-96 rounded-full bg-gradient-radial from-teal-200/40 to-transparent dark:from-teal-400/10 animate-pulse" />
        <div className="absolute bottom-20 right-1/3 w-80 h-80 rounded-full bg-gradient-radial from-emerald-200/30 to-transparent dark:from-emerald-400/8 animate-pulse delay-1000" />
        <div className="absolute top-1/2 right-20 w-64 h-64 rounded-full bg-gradient-radial from-cyan-200/35 to-transparent dark:from-cyan-400/10 animate-pulse delay-2000" />
      </div>
      
      {/* Geometric patterns */}
      <div className="absolute inset-0 opacity-20 dark:opacity-10">
        <svg className="w-full h-full" viewBox="0 0 800 600" fill="none">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="20" cy="20" r="1" fill="currentColor" className="text-teal-500/30" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Floating elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-10 w-6 h-6 rotate-45 bg-gradient-to-br from-teal-400/20 to-teal-600/30 dark:from-teal-400/10 dark:to-teal-600/15 animate-bounce duration-3000" />
        <div className="absolute top-3/4 right-16 w-4 h-4 rotate-12 bg-gradient-to-br from-emerald-400/25 to-emerald-600/35 dark:from-emerald-400/12 dark:to-emerald-600/18 animate-bounce delay-1000 duration-3000" />
        <div className="absolute top-1/2 left-1/3 w-3 h-3 rounded-full bg-gradient-to-br from-cyan-400/30 to-cyan-600/40 dark:from-cyan-400/15 dark:to-cyan-600/20 animate-bounce delay-2000 duration-3000" />
        <div className="absolute bottom-1/3 right-1/4 w-5 h-5 rotate-45 bg-gradient-to-br from-amber-400/20 to-amber-600/30 dark:from-amber-400/10 dark:to-amber-600/15 animate-bounce delay-500 duration-3000" />
      </div>
    </div>
  );
}

function Noise() {
  return (
    <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-overlay">
      <div className="w-full h-full bg-[linear-gradient(45deg,rgba(255,255,255,0.1)_0%,transparent_50%),linear-gradient(-45deg,rgba(255,255,255,0.08)_0%,transparent_50%)]" />
    </div>
  );
}

/* ---------------------------------- Icons ---------------------------------- */
/* (Simple inline SVG components to avoid extra deps) */

function ReportIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...iconProps(props)}>
      <path
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 4h9l7 7v9a1 1 0 0 1-1 1h-5m-4 0H5a1 1 0 0 1-1-1V4Z"
      />
      <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M13 4v6h6" />
    </svg>
  );
}
function BellIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...iconProps(props)}>
      <path
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9Z"
      />
      <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M10 21h4" />
    </svg>
  );
}
function TrackIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...iconProps(props)}>
      <circle cx="12" cy="12" r="9" strokeWidth="2" />
      <path strokeWidth="2" strokeLinecap="round" d="M12 7v5l3 3" />
    </svg>
  );
}
function AIIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...iconProps(props)}>
      <rect x="3" y="3" width="7" height="7" rx="1.5" strokeWidth="2" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" strokeWidth="2" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" strokeWidth="2" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" strokeWidth="2" />
    </svg>
  );
}
function LocationIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...iconProps(props)}>
      <path
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 21s7-7.2 7-11.5A7 7 0 0 0 5 9.5C5 13.8 12 21 12 21Z"
      />
      <circle cx="12" cy="9.5" r="2.5" strokeWidth="2" />
    </svg>
  );
}
function RewardIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...iconProps(props)}>
      <path
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m12 17-5.5 3L8 14l-5-4.5L9.5 9 12 3l2.5 6L21 9.5 16 14l1.5 6-5.5-3Z"
      />
    </svg>
  );
}
function iconProps(props) {
  return { className: "w-6 h-6", ...props };
}

export default HomePage;
