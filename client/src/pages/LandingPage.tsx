import { Link } from 'react-router-dom';

const highlights = [
  {
    title: 'Multi-tenant visibility',
    detail: 'Account groups isolate teams, colors, and geofences so admins only manage their own shifts.',
  },
  {
    title: 'Assignments with context',
    detail: 'Kids, ratios, instructions, and bans ride along on every payload so staff see what they need at a glance.',
  },
  {
    title: 'Autonomous scheduling',
    detail: 'Broadcast open shifts, ask for approvals, and optimize ratios with calendar, ratio, and reporting controls.',
  },
  {
    title: 'Modern delivery',
    detail: 'Built with React, Zustand, Flask, SQLAlchemy, OpenAPI, and Render-ready ops for secure deployments.',
  },
];

export const LandingPage = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-12 text-left sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-3">
          <p className="text-sm uppercase tracking-[0.6em] text-slate-400">staffmonitr</p>
          <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">
            Staff, assignments, and geofenced shifts for regulated sites.
          </h1>
          <p className="text-lg text-slate-400 sm:text-xl">
            Build ratios that comply, notifications that reach every role, and geofence checks that keep sensitive
            information on-site.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/signin"
              className="rounded-2xl border border-transparent bg-gradient-to-r from-brand-500 to-brand-700 px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white transition hover:opacity-90"
            >
              Sign in
            </Link>
            <Link
              to="/signup"
              className="rounded-2xl border border-slate-700 px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-slate-200 transition hover:border-slate-500"
            >
              Create account
            </Link>
          </div>
        </div>
        <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900/60 to-slate-950/60 p-6 shadow-2xl sm:w-96">
          <p className="text-xs uppercase tracking-[0.4em] text-slate-500">Live coverage</p>
          <p className="mt-3 text-2xl font-semibold text-white">24/7 multi-site scheduling</p>
          <p className="mt-2 text-sm text-slate-400">
            Publish shifts, invite owners, and configure open-shift approval flows with audits.
          </p>
          <dl className="mt-6 space-y-4 text-sm text-slate-300">
            <div className="flex items-center justify-between border-t border-slate-800 pt-3">
              <dt>Sites tracked</dt>
              <dd>12</dd>
            </div>
            <div className="flex items-center justify-between border-t border-slate-800 pt-3">
              <dt>Active ratios</dt>
              <dd>1:4 · 1:1 · 2:1</dd>
            </div>
            <div className="flex items-center justify-between border-t border-slate-800 pt-3">
              <dt>Email + push</dt>
              <dd>enabled</dd>
            </div>
          </dl>
        </div>
      </header>

      <section className="mx-auto max-w-6xl space-y-6 px-4 pb-16">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Capabilities</p>
              <h2 className="text-2xl font-semibold text-white">Designed for regulated facilities</h2>
              <p className="mt-1 text-sm text-slate-400">
                Role-based experiences, multi-tenant isolation, and geofence enforcement keep compliance predictable.
              </p>
            </div>
            <Link
              to="/signup"
              className="mt-4 rounded-full border border-slate-700 px-5 py-2 text-xs font-semibold uppercase tracking-[0.4em] text-white transition hover:border-slate-500 sm:mt-0"
            >
              Start free trial
            </Link>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {highlights.map((feature) => (
              <article key={feature.title} className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
                <p className="text-sm uppercase tracking-[0.4em] text-slate-500">{feature.title}</p>
                <p className="mt-2 text-sm text-slate-300">{feature.detail}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-8 text-sm text-slate-300">
          <p className="text-xs uppercase tracking-[0.4em] text-slate-500">How it works</p>
          <ol className="mt-4 space-y-3 pl-4 text-slate-200">
            <li>1. Invite admins and staff, assign account groups, and configure geofences per campus.</li>
            <li>2. Create shifts, define ratios, and distribute assignments with difficulty tags.</li>
            <li>3. Staff see schedules in their dashboard, open shifts surface in-app, and notifications keep everyone aligned.</li>
          </ol>
        </div>
      </section>
    </div>
  );
};
