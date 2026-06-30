import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ClipboardList, FilePlus2, ShieldCheck } from 'lucide-react';
import { ROUTES } from '@/lib/routes';

const foundationItems = [
  {
    title: 'Project Register',
    description: 'View the first PIT project register foundation for implementation tracking.',
    route: ROUTES.PROJECTS,
    cta: 'Open Project Register',
    icon: ClipboardList,
  },
  {
    title: 'Create Project',
    description: 'Start a non-persistent project intake foundation for the next governed slices.',
    route: ROUTES.PROJECTS_NEW,
    cta: 'Open Create Project',
    icon: FilePlus2,
  },
];

export const PitWorkspaceHub: React.FC = () => (
  <main className="min-h-screen bg-slate-50 px-6 py-8 text-slate-950" data-testid="pit-workspace-hub">
    <section className="mx-auto max-w-6xl space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">PIT Stage 12 Slice 2</p>
        <h1 className="mt-3 text-3xl font-bold">Project Implementation Tracker</h1>
        <p className="mt-3 max-w-3xl text-base text-slate-600">
          Project Workspace Foundation for entitled users. Use this hub to move from the PIT runtime entry into the first project register and project intake surfaces.
        </p>
        <div className="mt-6 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-5" data-testid="pit-state-data">
          <h2 className="text-lg font-semibold">Runtime state: data</h2>
          <p className="mt-2 text-sm text-slate-600">
            Slice 2 foundation ready. Data persistence, full project lifecycle, audit evidence, reporting, and AI assistance remain future governed slices.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {foundationItems.map((item) => {
          const Icon = item.icon;
          return (
            <article key={item.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="rounded-xl bg-slate-100 p-3 text-slate-700">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">{item.title}</h2>
                  <p className="mt-2 text-sm text-slate-600">{item.description}</p>
                </div>
              </div>
              <Link
                to={item.route}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                {item.cta}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </article>
          );
        })}
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="rounded-xl bg-slate-100 p-3 text-slate-700">
            <ShieldCheck className="h-6 w-6" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Governed slice boundary</h2>
            <p className="mt-2 text-sm text-slate-600">
              This slice is runtime-only. It does not change subscription, authentication, onboarding, dashboard entitlement, Supabase persistence, billing, reporting, audit workflow, or AI provider behavior.
            </p>
          </div>
        </div>
      </section>
    </section>
  </main>
);
