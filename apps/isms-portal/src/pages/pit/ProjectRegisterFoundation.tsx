import React, { useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Database, FolderKanban } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { ROUTES } from '@/lib/routes';
import { canCreatePitProject } from '@/lib/pitRoles';
import { listPitProjects, type PitProjectRecord } from '@/lib/pitProjectPersistence';

const typeLabel: Record<PitProjectRecord['type'], string> = { project: 'Project', operational: 'Operational Stream', improvement: 'Improvement' };
const horizonLabel: Record<PitProjectRecord['quickWinType'], string> = { quick_win: 'Quick Win', medium_term: 'Medium Term', long_term: 'Long Term' };
const sourceLabel: Record<PitProjectRecord['sourceType'], string> = { manual: 'Manual', risk: 'Risk Management', audit: 'Audit finding', incident: 'Incident Management', roadmap: 'Maturity Roadmap' };
const money = (value: number | null) => value == null ? '—' : new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR' }).format(value);

export const ProjectRegisterFoundation: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [projects] = useState(() => listPitProjects());
  const createdProjectId = (location.state as { createdProjectId?: string } | null)?.createdProjectId;
  const canCreate = user ? canCreatePitProject(user.role) : false;
  const summary = useMemo(() => ({ total: projects.length, quickWins: projects.filter((item) => item.quickWinType === 'quick_win').length, improvements: projects.filter((item) => item.type === 'improvement').length }), [projects]);

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-8 text-slate-950" data-testid="pit-project-register">
      <section className="mx-auto max-w-7xl space-y-6">
        <header className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">PIT Stage 12 Slice 3</p>
          <h1 className="mt-3 text-3xl font-bold">PIT Project Register</h1>
          <p className="mt-3 text-slate-600">Projects created in this browser are loaded from the typed Slice 3 persistence adapter.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            {canCreate ? <Link to={ROUTES.PROJECTS_NEW} className="inline-flex items-center gap-2 rounded-lg bg-slate-950 px-4 py-3 font-semibold text-white">Create a project<ArrowRight className="h-4 w-4" /></Link> : <div className="rounded-lg border bg-slate-50 px-4 py-3 text-sm text-slate-600">Create Project is unavailable for viewer and non-creator roles.</div>}
            <Link to={ROUTES.PIT_TRACKER} className="rounded-lg border border-slate-300 px-4 py-3 font-semibold">Back to PIT hub</Link>
          </div>
        </header>

        {createdProjectId && <div role="status" className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-900"><CheckCircle2 className="h-5 w-5" />Project created and added to this browser's PIT register.</div>}

        <div className="grid gap-4 md:grid-cols-3">
          {[['Projects', summary.total], ['Quick Wins', summary.quickWins], ['Improvements', summary.improvements]].map(([label, value]) => <article key={String(label)} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><FolderKanban className="h-6 w-6 text-slate-700" /><p className="mt-4 text-3xl font-bold">{value}</p><h2 className="text-sm font-semibold text-slate-600">{label}</h2></article>)}
        </div>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b p-5"><h2 className="text-xl font-semibold">Project records</h2></div>
          {projects.length === 0 ? <div className="p-10 text-center"><FolderKanban className="mx-auto h-10 w-10 text-slate-400" /><h3 className="mt-4 text-lg font-semibold">No projects have been created yet</h3>{canCreate && <Link to={ROUTES.PROJECTS_NEW} className="mt-5 inline-flex items-center gap-2 rounded-lg bg-slate-950 px-4 py-3 text-white">Create the first project<ArrowRight className="h-4 w-4" /></Link>}</div> : <div className="overflow-x-auto"><table className="min-w-full divide-y text-left text-sm"><thead className="bg-slate-50"><tr><th className="px-5 py-3">Project</th><th className="px-5 py-3">Classification</th><th className="px-5 py-3">Responsible person</th><th className="px-5 py-3">Timeline</th><th className="px-5 py-3">Source</th><th className="px-5 py-3">Cost</th></tr></thead><tbody className="divide-y">{projects.map((project) => <tr key={project.id} className={project.id === createdProjectId ? 'bg-emerald-50' : ''}><td className="px-5 py-4"><strong>{project.name}</strong><p className="mt-1 max-w-xs text-xs text-slate-500">{project.description || 'No description supplied'}</p></td><td className="px-5 py-4">{typeLabel[project.type]}<p className="text-xs text-slate-500">{horizonLabel[project.quickWinType]}</p></td><td className="px-5 py-4">{project.projectLeaderLabel}</td><td className="px-5 py-4">{project.startDate}<p className="text-xs text-slate-500">to {project.endDate}</p></td><td className="px-5 py-4">{sourceLabel[project.sourceType]}{project.sourceRef && <p className="text-xs text-slate-500">{project.sourceRef}</p>}</td><td className="px-5 py-4">CAPEX: {money(project.capexAmount)}<p>OPEX: {money(project.opexAmount)}</p>{project.fiscalYear && <p className="text-xs text-slate-500">FY {project.fiscalYear}</p>}</td></tr>)}</tbody></table></div>}
        </section>

        <div className="flex gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-950"><Database className="h-5 w-5 shrink-0" /><p><strong>Delivered boundary:</strong> browser-local persistence only. Production Supabase tables, RLS, shared organisation data and cross-device synchronisation are not claimed.</p></div>
      </section>
    </main>
  );
};
