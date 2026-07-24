import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Database, FolderKanban, RefreshCw } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { ROUTES } from '@/lib/routes';
import { canCreatePitProject } from '@/lib/pitRoles';
import { getPitProjectRepository } from '@/lib/supabasePitProjectClient';
import type { PitProjectRecord } from '@/lib/pitProjectRepository';

export const ProjectRegisterFoundation: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [projects, setProjects] = useState<PitProjectRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const created = Boolean((location.state as { created?: boolean } | null)?.created);
  const canCreate = user ? canCreatePitProject(user.role) : false;
  const load = async () => { setLoading(true); setError(null); try { setProjects(await getPitProjectRepository().list()); } catch (reason) { setError(reason instanceof Error ? reason.message : 'Projects could not be loaded.'); } finally { setLoading(false); } };
  useEffect(() => { void load(); }, []);
  const summary = useMemo(() => ({ total: projects.length, quickWins: projects.filter((p) => p.quickWinType === 'quick_win').length, improvements: projects.filter((p) => p.type === 'improvement').length }), [projects]);

  return <main className="min-h-screen bg-slate-50 px-6 py-8 text-slate-950"><section className="mx-auto max-w-7xl space-y-6">
    <header className="rounded-2xl border bg-white p-8 shadow-sm"><p className="text-sm font-semibold uppercase tracking-wide text-slate-500">PIT Stage 12 Slice 4</p><h1 className="mt-3 text-3xl font-bold">PIT Project Register</h1><p className="mt-3 text-slate-600">Organisation-scoped records loaded from Supabase under authenticated RLS.</p><div className="mt-6 flex gap-3">{canCreate && <Link to={ROUTES.PROJECTS_NEW} className="inline-flex items-center gap-2 rounded-lg bg-slate-950 px-4 py-3 font-semibold text-white">Create a project<ArrowRight className="h-4 w-4" /></Link>}<button onClick={() => void load()} className="inline-flex items-center gap-2 rounded-lg border px-4 py-3"><RefreshCw className="h-4 w-4" />Refresh</button></div></header>
    {created && <div role="status" className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-900"><CheckCircle2 className="h-5 w-5" />Project created in Supabase.</div>}
    <div className="grid gap-4 md:grid-cols-3">{[['Projects', summary.total], ['Quick Wins', summary.quickWins], ['Improvements', summary.improvements]].map(([label, value]) => <article key={String(label)} className="rounded-2xl border bg-white p-5 shadow-sm"><FolderKanban className="h-6 w-6" /><p className="mt-4 text-3xl font-bold">{value}</p><h2 className="text-sm text-slate-600">{label}</h2></article>)}</div>
    <section className="overflow-hidden rounded-2xl border bg-white shadow-sm"><div className="border-b p-5"><h2 className="text-xl font-semibold">Project records</h2></div>
      {loading ? <div className="p-10" data-testid="pit-register-loading">Loading projects…</div> : error ? <div className="p-10" role="alert"><p className="font-semibold text-red-800">{error}</p><button onClick={() => void load()} className="mt-4 rounded-lg border px-4 py-2">Retry</button></div> : projects.length === 0 ? <div className="p-10 text-center"><FolderKanban className="mx-auto h-10 w-10 text-slate-400" /><h3 className="mt-4 text-lg font-semibold">No Supabase projects yet</h3>{canCreate && <Link to={ROUTES.PROJECTS_NEW} className="mt-5 inline-flex rounded-lg bg-slate-950 px-4 py-3 text-white">Create the first project</Link>}</div> : <div className="divide-y">{projects.map((project) => <Link key={project.id} to={`/projects/${project.id}`} className="grid gap-2 p-5 hover:bg-slate-50 sm:grid-cols-4"><div className="sm:col-span-2"><strong>{project.name}</strong><p className="text-sm text-slate-500">{project.description || 'No description'}</p></div><div>{project.type}<p className="text-xs text-slate-500">{project.quickWinType}</p></div><div>{project.startDate} → {project.endDate}<p className="text-xs text-slate-500">{project.status}</p></div></Link>)}</div>}
    </section>
    <div className="flex gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-950"><Database className="h-5 w-5 shrink-0" /><p><strong>Compatibility boundary:</strong> former browser-local records remain non-destructive historical browser data and are not represented as migrated Supabase records.</p></div>
  </section></main>;
};
