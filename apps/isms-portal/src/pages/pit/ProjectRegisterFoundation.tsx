import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ClipboardCheck, FilePlus2, Layers3 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { ROUTES } from '@/lib/routes';
import { canCreatePitProject } from '@/lib/pitRoles';

const registerRows = [
  {
    name: 'Security improvement project register',
    status: 'Foundation',
    readiness: 'Structure only',
    nextStep: 'Define project intake fields in the next governed slice',
  },
  {
    name: 'Implementation evidence readiness',
    status: 'Planned',
    readiness: 'Future slice',
    nextStep: 'Link evidence capture after project persistence is approved',
  },
  {
    name: 'Deviation and progress tracking',
    status: 'Planned',
    readiness: 'Future slice',
    nextStep: 'Add project status and control-effectiveness signals later',
  },
];

export const ProjectRegisterFoundation: React.FC = () => {
  const { user } = useAuth();
  const canCreateProject = user ? canCreatePitProject(user.role) : false;

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-8 text-slate-950" data-testid="pit-project-register">
      <section className="mx-auto max-w-6xl space-y-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">PIT Stage 12 Slice 2</p>
          <h1 className="mt-3 text-3xl font-bold">PIT Project Register</h1>
          <p className="mt-3 max-w-3xl text-base text-slate-600">
            Project Register foundation for tracking security improvement projects and implementation readiness. This slice provides the governed workspace shape before database persistence is introduced.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            {canCreateProject ? (
              <Link
                to={ROUTES.PROJECTS_NEW}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Open Create Project foundation
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            ) : (
              <div className="rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                Create Project is hidden for viewer and non-creator roles in this slice.
              </div>
            )}
            <Link
              to={ROUTES.PIT_TRACKER}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-100"
            >
              Back to PIT hub
            </Link>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <ClipboardCheck className="h-6 w-6 text-slate-700" aria-hidden="true" />
            <h2 className="mt-4 text-lg font-semibold">Register foundation</h2>
            <p className="mt-2 text-sm text-slate-600">Shows the first project workspace structure without creating production records.</p>
          </article>
          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <FilePlus2 className="h-6 w-6 text-slate-700" aria-hidden="true" />
            <h2 className="mt-4 text-lg font-semibold">Project intake ready</h2>
            <p className="mt-2 text-sm text-slate-600">Connects to a non-persistent Create Project foundation for Slice 2 validation.</p>
          </article>
          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <Layers3 className="h-6 w-6 text-slate-700" aria-hidden="true" />
            <h2 className="mt-4 text-lg font-semibold">Future lifecycle</h2>
            <p className="mt-2 text-sm text-slate-600">Evidence, audit trails, reporting, and persistence remain future governed slices.</p>
          </article>
        </div>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 p-5">
            <h2 className="text-xl font-semibold">Project workspace readiness map</h2>
            <p className="mt-2 text-sm text-slate-600">Foundation-only register view. These are not production project records.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-5 py-3 font-semibold">Workspace area</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 font-semibold">Readiness</th>
                  <th className="px-5 py-3 font-semibold">Next governed step</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {registerRows.map((row) => (
                  <tr key={row.name}>
                    <td className="px-5 py-4 font-medium text-slate-900">{row.name}</td>
                    <td className="px-5 py-4 text-slate-700">{row.status}</td>
                    <td className="px-5 py-4 text-slate-700">{row.readiness}</td>
                    <td className="px-5 py-4 text-slate-600">{row.nextStep}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </section>
    </main>
  );
};
