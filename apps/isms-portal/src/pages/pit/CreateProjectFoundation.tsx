import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, FileText, ShieldAlert } from 'lucide-react';
import { ROUTES } from '@/lib/routes';

const intakeFields = [
  'Project title',
  'Operational area',
  'Implementation objective',
  'Responsible person',
  'Evidence readiness note',
];

export const CreateProjectFoundation: React.FC = () => (
  <main className="min-h-screen bg-slate-50 px-6 py-8 text-slate-950" data-testid="pit-create-project">
    <section className="mx-auto max-w-5xl space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">PIT Stage 12 Slice 2</p>
        <h1 className="mt-3 text-3xl font-bold">Create Project Foundation</h1>
        <p className="mt-3 max-w-3xl text-base text-slate-600">
          Non-persistent project intake foundation for creator-capable roles. This surface validates the first project creation workflow shape without writing production records.
        </p>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="rounded-xl bg-slate-100 p-3 text-slate-700">
            <FileText className="h-6 w-6" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Draft intake structure</h2>
            <p className="mt-2 text-sm text-slate-600">
              The fields below describe the controlled intake shape for future persistence work. Inputs are intentionally disabled in this slice to avoid implying database writes.
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-4">
          {intakeFields.map((field) => (
            <label key={field} className="grid gap-2 text-sm font-medium text-slate-800">
              {field}
              <input
                disabled
                className="rounded-lg border border-slate-300 bg-slate-100 px-3 py-2 text-slate-500"
                placeholder={`${field} will be captured in a later governed slice`}
              />
            </label>
          ))}
        </div>

        <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          <div className="flex gap-3">
            <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
            <p>
              No project is saved in Slice 2. Supabase persistence, project IDs, evidence uploads, approvals, audit trails, and reporting require separate governed slices.
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link
            to={ROUTES.PROJECTS}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Return to Project Register
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <Link
            to={ROUTES.PIT_TRACKER}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-100"
          >
            Back to PIT hub
          </Link>
        </div>
      </section>
    </section>
  </main>
);
