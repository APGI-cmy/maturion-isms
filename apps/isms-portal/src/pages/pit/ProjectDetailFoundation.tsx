import React, { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { AlertTriangle, ArrowLeft, CheckCircle2, Loader2, Save, ShieldAlert } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { ROUTES } from '@/lib/routes';
import { getPitProjectRepository } from '@/lib/supabasePitProjectClient';
import { resolvePitProjectDetailState, type PitProjectRecord, type PitProjectStatus } from '@/lib/pitProjectRepository';

const UPDATE_ROLES = new Set(['team_leader', 'project_manager', 'org_admin', 'cs2_admin']);

export const ProjectDetailFoundation: React.FC = () => {
  const { id = '' } = useParams();
  const { user } = useAuth();
  const location = useLocation();
  const [project, setProject] = useState<PitProjectRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(Boolean((location.state as { created?: boolean } | null)?.created));
  const [form, setForm] = useState({ name: '', description: '', status: 'active' as PitProjectStatus, startDate: '', endDate: '' });
  const denied = !user;
  const load = async () => { setLoading(true); setError(null); try { const value = await getPitProjectRepository().getById(id); setProject(value); if (value) setForm({ name: value.name, description: value.description, status: value.status, startDate: value.startDate, endDate: value.endDate }); } catch (reason) { setError(reason instanceof Error ? reason : new Error('Unable to load project')); } finally { setLoading(false); } };
  useEffect(() => { void load(); }, [id]);
  const state = resolvePitProjectDetailState({ loading, denied, error, project });

  if (state === 'loading') return <main className="min-h-screen bg-slate-50 p-10" data-testid="pit-detail-loading"><Loader2 className="h-6 w-6 animate-spin" /> Loading project…</main>;
  if (state === 'denied') return <main className="min-h-screen bg-slate-50 p-10" data-testid="pit-detail-denied"><ShieldAlert className="h-8 w-8" /><h1 className="mt-4 text-2xl font-bold">Permission denied</h1><Link to={ROUTES.LOGIN} className="mt-4 inline-block underline">Sign in</Link></main>;
  if (state === 'error') return <main className="min-h-screen bg-slate-50 p-10" data-testid="pit-detail-error"><AlertTriangle className="h-8 w-8 text-red-700" /><h1 className="mt-4 text-2xl font-bold">Project could not be loaded</h1><p>{error?.message}</p><button onClick={() => void load()} className="mt-4 rounded-lg border px-4 py-2">Retry</button></main>;
  if (state === 'not-found' || !project) return <main className="min-h-screen bg-slate-50 p-10" data-testid="pit-detail-not-found"><h1 className="text-2xl font-bold">Project not found</h1><p className="mt-2">The project does not exist or RLS does not permit access.</p><Link to={ROUTES.PROJECTS} className="mt-4 inline-block underline">Return to Project Register</Link></main>;

  const canUpdate = Boolean(user && UPDATE_ROLES.has(user.role));
  const save = async (event: React.FormEvent) => { event.preventDefault(); if (!canUpdate || saving) return; setSaving(true); setSaved(false); setError(null); try { const updated = await getPitProjectRepository().update(project.id, form); setProject(updated); setSaved(true); } catch (reason) { setError(reason instanceof Error ? reason : new Error('Unable to update project')); } finally { setSaving(false); } };

  return <main className="min-h-screen bg-slate-50 px-6 py-8 text-slate-950" data-testid="pit-detail-data"><section className="mx-auto max-w-5xl space-y-6">
    <Link to={ROUTES.PROJECTS} className="inline-flex items-center gap-2 font-semibold"><ArrowLeft className="h-4 w-4" />Project Register</Link>
    <header className="rounded-2xl border bg-white p-8 shadow-sm"><p className="text-sm font-semibold uppercase tracking-wide text-slate-500">PIT Stage 12 Slice 4</p><h1 className="mt-3 text-3xl font-bold">{project.name}</h1><p className="mt-3 text-slate-600">Supabase project overview for the authenticated organisation.</p>{saved && <div role="status" className="mt-4 flex items-center gap-2 text-emerald-800"><CheckCircle2 className="h-5 w-5" />Project saved.</div>}</header>
    <form onSubmit={save} className="grid gap-4 rounded-2xl border bg-white p-6 shadow-sm sm:grid-cols-2">
      <label className="grid gap-2 text-sm font-medium sm:col-span-2">Project name<input className="rounded-lg border px-3 py-2" disabled={!canUpdate} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
      <label className="grid gap-2 text-sm font-medium sm:col-span-2">Description<textarea className="min-h-24 rounded-lg border px-3 py-2" disabled={!canUpdate} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></label>
      <label className="grid gap-2 text-sm font-medium">Start date<input type="date" className="rounded-lg border px-3 py-2" disabled={!canUpdate} value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} /></label>
      <label className="grid gap-2 text-sm font-medium">End date<input type="date" className="rounded-lg border px-3 py-2" disabled={!canUpdate} value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} /></label>
      <label className="grid gap-2 text-sm font-medium">Status<select className="rounded-lg border px-3 py-2" disabled={!canUpdate} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as PitProjectStatus })}><option value="active">Active</option><option value="paused">Paused</option><option value="completed">Completed</option></select></label>
      <dl className="rounded-lg bg-slate-50 p-4 text-sm"><dt className="font-semibold">Source</dt><dd>{project.sourceType}{project.sourceRef ? ` — ${project.sourceRef}` : ''}</dd><dt className="mt-2 font-semibold">Responsible person</dt><dd>{project.projectLeaderLabel}</dd></dl>
      {error && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-900 sm:col-span-2">{error.message}</p>}
      <div className="sm:col-span-2">{canUpdate ? <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-lg bg-slate-950 px-4 py-3 font-semibold text-white"><Save className="h-4 w-4" />{saving ? 'Saving…' : 'Save changes'}</button> : <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">Your role has read-only access to this project.</div>}</div>
    </form>
  </section></main>;
};
