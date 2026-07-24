import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Database, ShieldAlert } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { ROUTES } from '@/lib/routes';
import { canCreatePitProject } from '@/lib/pitRoles';
import { getPitProjectRepository } from '@/lib/supabasePitProjectClient';
import type { CreatePitProjectInput, PitProjectSourceType, PitProjectType, PitQuickWinType } from '@/lib/pitProjectRepository';

const initialForm: CreatePitProjectInput = {
  name: '', type: 'project', quickWinType: 'medium_term', description: '', projectLeaderLabel: '',
  startDate: '', endDate: '', sourceType: 'manual', sourceRef: '', capexAmount: null, opexAmount: null, fiscalYear: '',
};
const fieldClass = 'rounded-lg border border-slate-300 px-3 py-2';

export const CreateProjectFoundation: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState<CreatePitProjectInput>(initialForm);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const permitted = user ? canCreatePitProject(user.role) : false;

  if (!user || !permitted) return <main className="min-h-screen bg-slate-50 px-6 py-8"><section className="mx-auto max-w-3xl rounded-2xl border border-amber-200 bg-amber-50 p-8"><ShieldAlert className="h-8 w-8 text-amber-800" /><h1 className="mt-4 text-2xl font-bold">Project creation is not available</h1><p className="mt-3">A creator-capable authenticated PIT role is required.</p><Link className="mt-6 inline-block font-semibold underline" to={ROUTES.PROJECTS}>Return to Project Register</Link></section></main>;

  const update = <K extends keyof CreatePitProjectInput>(key: K, value: CreatePitProjectInput[K]) => { setForm((current) => ({ ...current, [key]: value })); setError(null); };
  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true); setError(null);
    try {
      const created = await getPitProjectRepository().create(form);
      navigate(`/projects/${created.id}`, { replace: true, state: { created: true } });
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'The project could not be created.');
      setIsSubmitting(false);
    }
  };

  return <main className="min-h-screen bg-slate-50 px-6 py-8 text-slate-950" data-testid="pit-create-project"><form onSubmit={submit} className="mx-auto max-w-4xl space-y-6">
    <header className="rounded-2xl border bg-white p-8 shadow-sm"><p className="text-sm font-semibold uppercase tracking-wide text-slate-500">PIT Stage 12 Slice 4</p><h1 className="mt-3 text-3xl font-bold">Create a PIT Project</h1><p className="mt-3 text-slate-600">One valid submission creates one organisation-bound project and one governed source link in Supabase.</p></header>
    <section className="grid gap-4 rounded-2xl border bg-white p-6 shadow-sm sm:grid-cols-2">
      <label className="grid gap-2 text-sm font-medium sm:col-span-2">Project name<input className={fieldClass} value={form.name} onChange={(e) => update('name', e.target.value)} required /></label>
      <label className="grid gap-2 text-sm font-medium">Project type<select className={fieldClass} value={form.type} onChange={(e) => update('type', e.target.value as PitProjectType)}><option value="project">Project</option><option value="operational">Operational Stream</option><option value="improvement">Improvement</option></select></label>
      <label className="grid gap-2 text-sm font-medium">Delivery classification<select className={fieldClass} value={form.quickWinType} onChange={(e) => update('quickWinType', e.target.value as PitQuickWinType)}><option value="quick_win">Quick Win</option><option value="medium_term">Medium Term</option><option value="long_term">Long Term</option></select></label>
      <label className="grid gap-2 text-sm font-medium sm:col-span-2">Description<textarea className={`${fieldClass} min-h-24`} value={form.description} onChange={(e) => update('description', e.target.value)} /></label>
      <label className="grid gap-2 text-sm font-medium sm:col-span-2">Responsible person<input className={fieldClass} value={form.projectLeaderLabel} onChange={(e) => update('projectLeaderLabel', e.target.value)} required /></label>
      <label className="grid gap-2 text-sm font-medium">Start date<input type="date" className={fieldClass} value={form.startDate} onChange={(e) => update('startDate', e.target.value)} required /></label>
      <label className="grid gap-2 text-sm font-medium">End date<input type="date" className={fieldClass} value={form.endDate} onChange={(e) => update('endDate', e.target.value)} required /></label>
      <label className="grid gap-2 text-sm font-medium">Source type<select className={fieldClass} value={form.sourceType} onChange={(e) => update('sourceType', e.target.value as PitProjectSourceType)}><option value="manual">Manual</option><option value="risk">Risk</option><option value="audit">Audit</option><option value="incident">Incident</option><option value="roadmap">Roadmap</option></select></label>
      <label className="grid gap-2 text-sm font-medium">Source reference<input className={fieldClass} disabled={form.sourceType === 'manual'} value={form.sourceRef || ''} onChange={(e) => update('sourceRef', e.target.value)} /></label>
      <label className="grid gap-2 text-sm font-medium">CAPEX<input type="number" min="0" className={fieldClass} value={form.capexAmount ?? ''} onChange={(e) => update('capexAmount', e.target.value === '' ? null : Number(e.target.value))} /></label>
      <label className="grid gap-2 text-sm font-medium">OPEX<input type="number" min="0" className={fieldClass} value={form.opexAmount ?? ''} onChange={(e) => update('opexAmount', e.target.value === '' ? null : Number(e.target.value))} /></label>
      <label className="grid gap-2 text-sm font-medium">Fiscal year<input className={fieldClass} value={form.fiscalYear || ''} onChange={(e) => update('fiscalYear', e.target.value)} /></label>
      {error && <div role="alert" className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-900 sm:col-span-2">{error}</div>}
      <div className="flex justify-between sm:col-span-2"><Link to={ROUTES.PROJECTS} className="inline-flex items-center gap-2 rounded-lg border px-4 py-3"><ArrowLeft className="h-4 w-4" />Cancel</Link><button type="submit" disabled={isSubmitting} className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-4 py-3 font-semibold text-white disabled:opacity-60">{isSubmitting ? 'Creating…' : 'Create project'}<CheckCircle2 className="h-4 w-4" /></button></div>
    </section>
    <div className="flex gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-950"><Database className="h-5 w-5 shrink-0" /><p><strong>Governed persistence:</strong> organisation and actor identifiers come from the authenticated Supabase session and RLS—not editable form fields.</p></div>
  </form></main>;
};
