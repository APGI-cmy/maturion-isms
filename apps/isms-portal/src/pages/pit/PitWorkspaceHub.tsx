import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ClipboardList, FilePlus2, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { ROUTES } from '@/lib/routes';
import { PIT_PROJECT_CREATE_ROLES } from '@/lib/pitRoles';

const foundationItems = [
  {
    title: 'Project Register',
    description: 'View the first PIT project register foundation for implementation tracking.',
    route: ROUTES.PROJECTS,
    cta: 'Open Project Register',
    icon: ClipboardList,
    roleLimited: false,
  },
  {
    title: 'Create Project',
    description: 'Start a non-persistent project intake foundation for the next governed slices.',
    route: ROUTES.PROJECTS_NEW,
    cta: 'Open Create Project',
    icon: FilePlus2,
    roleLimited: true,
  },
];

export const PitWorkspaceHub: React.FC = () => {
  const { user } = useAuth();
  const canCreateProject = Boolean(user && PIT_PROJECT_CREATE_ROLES.includes(user.role));
  const visibleItems = foundationItems.filter((item) => !item.roleLimited || canCreateProject);

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-8 text-slate-950" data-testid="pit-workspace-hub">
      <section className="mx-auto max-w-6xl space-y-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">PIT Stage 12 Slice 2.3</p>
          <h1 className="mt-3 text-3xl font-bold">Project Implementation Tracker</h1>
          <p className="mt-3 max-w-3xl text-base text-slate-600">
            Private PIT workspace for authenticated and entitled users. Navigation now reflects role permissions before a user attempts restricted project actions.
          </p>
          <div className="mt-6 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-5" data-testid="pit-role-state">
            <h2 className="text-lg font-semibold">Role-aware route state</h2>
            <p className="mt-2 text-sm text-slate-600">
              Current mock role: {user?.role ?? 'unknown'}. Project creation CTA: {canCreateProject ? 'visible' : 'hidden'}.
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {visibleItems.map((item) => {
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

        {!canCreateProject && (
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm" data-testid="pit-create-hidden-notice">
            <h2 className="text-xl font-semibold">Project creation hidden for this role</h2>
            <p className="mt-2 text-sm text-slate-600">
              Viewers can see the register foundation, but creation actions require contributor, team leader, project manager, organisation administrator, or CS2 administrator role.
            </p>
          </section>
        )}

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="rounded-xl bg-slate-100 p-3 text-slate-700">
              <ShieldCheck className="h-6 w-6" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Governed slice boundary</h2>
              <p className="mt-2 text-sm text-slate-600">
                Slice 2.3 implements entry and role-aware navigation only. Persistence, full lifecycle, reporting, audit workflow, billing providers, and AI assistance remain governed future slices.
              </p>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
};
