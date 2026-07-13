import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CheckCircle2, Database, ShieldAlert } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { ROUTES } from '@/lib/routes';
import { canCreatePitProject } from '@/lib/pitRoles';
import {
  createPitProject,
  type CreatePitProjectInput,
  type PitProjectSourceType,
  type PitProjectType,
  type PitQuickWinType,
} from '@/lib/pitProjectPersistence';

const stepNames = ['Core details', 'Timeline', 'Source', 'Cost', 'Review'];
const initialForm: CreatePitProjectInput = {
  name: '', type: 'project', quickWinType: 'medium_term', description: '', projectLeaderLabel: '',
  startDate: '', endDate: '', sourceType: 'manual', sourceRef: '', capexAmount: null,
  opexAmount: null, fiscalYear: '',
};

const fieldClass = 'rounded-lg border border-slate-300 px-3 py-2';

export const CreateProjectFoundation: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<CreatePitProjectInput>(initialForm);
  const [error, setError] = useState<string | null>(null);
  const permitted = user ? canCreatePitProject(user.role) : false;

  if (!user || !permitted) {
    return (
      <main className="min-h-screen bg-slate-50 px-6 py-8" data-testid="pit-create-project-denied">
        <section className="mx-auto max-w-3xl rounded-2xl border border-amber-200 bg-amber-50 p-8">
          <ShieldAlert className="h-8 w-8 text-amber-800" />
          <h1 className="mt-4 text-2xl font-bold">Project creation is not available for this role</h1>
          <p className="mt-3 text-amber-900">Your current PIT role may view authorised projects but may not create one.</p>
          <Link className="mt-6 inline-block font-semibold underline" to={ROUTES.PROJECTS}>Return to Project Register</Link>
        </section>
      </main>
    );
  }

  const update = <K extends keyof CreatePitProjectInput>(key: K, value: CreatePitProjectInput[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
    setError(null);
  };

  const continueFlow = () => {
    if (step === 0 && (!form.name.trim() || !form.projectLeaderLabel.trim())) return setError('Project name and responsible person are required.');
    if (step === 1 && (!form.startDate || !form.endDate)) return setError('Start and end dates are required.');
    if (step === 1 && form.endDate < form.startDate) return setError('End date must be on or after the start date.');
    if (step === 2 && form.sourceType !== 'manual' && !form.sourceRef?.trim()) return setError('A source reference is required.');
    setError(null);
    setStep((current) => Math.min(current + 1, 4));
  };

  const submit = () => {
    try {
      const created = createPitProject(form, { id: user.id, email: user.email, role: user.role, orgId: 'mock-org' });
      navigate(ROUTES.PROJECTS, { replace: true, state: { createdProjectId: created.id } });
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'The project could not be created.');
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-8 text-slate-950" data-testid="pit-create-project">
      <section className="mx-auto max-w-5xl space-y-6">
        <header className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">PIT Stage 12 Slice 3</p>
          <h1 className="mt-3 text-3xl font-bold">Create a PIT Project</h1>
          <p className="mt-3 text-slate-600">Capture a controlled project foundation and review it before writing it to this browser's PIT register.</p>
        </header>

        <ol className="grid gap-2 sm:grid-cols-5" aria-label="Project creation progress">
          {stepNames.map((name, index) => <li key={name} className={`rounded-lg border px-3 py-2 text-sm font-semibold ${index === step ? 'bg-slate-950 text-white' : 'bg-white text-slate-500'}`}>{index + 1}. {name}</li>)}
        </ol>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          {step === 0 && <div className="grid gap-4">
            <h2 className="text-xl font-semibold">Core details</h2>
            <label className="grid gap-2 text-sm font-medium">Project name<input className={fieldClass} value={form.name} onChange={(e) => update('name', e.target.value)} /></label>
            <label className="grid gap-2 text-sm font-medium">Project type<select className={fieldClass} value={form.type} onChange={(e) => update('type', e.target.value as PitProjectType)}><option value="project">Project</option><option value="operational">Operational Stream</option><option value="improvement">Improvement</option></select></label>
            <label className="grid gap-2 text-sm font-medium">Description<textarea className={`${fieldClass} min-h-24`} value={form.description} onChange={(e) => update('description', e.target.value)} /></label>
            <label className="grid gap-2 text-sm font-medium">Responsible person / project leader<input className={fieldClass} value={form.projectLeaderLabel} placeholder={user.email} onChange={(e) => update('projectLeaderLabel', e.target.value)} /></label>
          </div>}

          {step === 1 && <div className="grid gap-4">
            <h2 className="text-xl font-semibold">Timeline</h2>
            <div className="grid gap-4 sm:grid-cols-2"><label className="grid gap-2 text-sm font-medium">Start date<input type="date" className={fieldClass} value={form.startDate} onChange={(e) => update('startDate', e.target.value)} /></label><label className="grid gap-2 text-sm font-medium">End date<input type="date" className={fieldClass} value={form.endDate} onChange={(e) => update('endDate', e.target.value)} /></label></div>
            <label className="grid gap-2 text-sm font-medium">Delivery classification<select className={fieldClass} value={form.quickWinType} onChange={(e) => update('quickWinType', e.target.value as PitQuickWinType)}><option value="quick_win">Quick Win</option><option value="medium_term">Medium Term</option><option value="long_term">Long Term</option></select></label>
          </div>}

          {step === 2 && <div className="grid gap-4">
            <h2 className="text-xl font-semibold">Originating source</h2>
            <label className="grid gap-2 text-sm font-medium">Source type<select className={fieldClass} value={form.sourceType} onChange={(e) => update('sourceType', e.target.value as PitProjectSourceType)}><option value="manual">Manual / no linked source</option><option value="risk">Risk Management</option><option value="audit">Audit finding</option><option value="incident">Incident Management</option><option value="roadmap">Maturity Roadmap</option></select></label>
            {form.sourceType !== 'manual' && <label className="grid gap-2 text-sm font-medium">Source reference<input className={fieldClass} value={form.sourceRef || ''} onChange={(e) => update('sourceRef', e.target.value)} /></label>}
          </div>}

          {step === 3 && <div className="grid gap-4">
            <h2 className="text-xl font-semibold">Optional cost context</h2>
            <div className="grid gap-4 sm:grid-cols-2"><label className="grid gap-2 text-sm font-medium">CAPEX amount<input type="number" min="0" className={fieldClass} value={form.capexAmount ?? ''} onChange={(e) => update('capexAmount', e.target.value === '' ? null : Number(e.target.value))} /></label><label className="grid gap-2 text-sm font-medium">OPEX amount<input type="number" min="0" className={fieldClass} value={form.opexAmount ?? ''} onChange={(e) => update('opexAmount', e.target.value === '' ? null : Number(e.target.value))} /></label></div>
            <label className="grid gap-2 text-sm font-medium">Fiscal year<input className={fieldClass} value={form.fiscalYear || ''} onChange={(e) => update('fiscalYear', e.target.value)} /></label>
          </div>}

          {step === 4 && <div className="space-y-4"><div className="flex items-center gap-3"><CheckCircle2 className="h-6 w-6 text-emerald-700" /><h2 className="text-xl font-semibold">Review before creating</h2></div><dl className="grid gap-4 rounded-xl bg-slate-50 p-5 sm:grid-cols-2"><div><dt className="text-xs uppercase text-slate-500">Project</dt><dd className="font-medium">{form.name}</dd></div><div><dt className="text-xs uppercase text-slate-500">Type</dt><dd>{form.type}</dd></div><div><dt className="text-xs uppercase text-slate-500">Leader</dt><dd>{form.projectLeaderLabel}</dd></div><div><dt className="text-xs uppercase text-slate-500">Dates</dt><dd>{form.startDate} to {form.endDate}</dd></div><div><dt className="text-xs uppercase text-slate-500">Source</dt><dd>{form.sourceType}{form.sourceRef ? ` — ${form.sourceRef}` : ''}</dd></div><div><dt className="text-xs uppercase text-slate-500">Delivery</dt><dd>{form.quickWinType}</dd></div></dl></div>}

          {error && <div role="alert" className="mt-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-900">{error}</div>}
          <div className="mt-6 flex justify-between"><button type="button" disabled={step === 0} onClick={() => setStep((value) => Math.max(0, value - 1))} className="inline-flex items-center gap-2 rounded-lg border px-4 py-3 disabled:opacity-40"><ArrowLeft className="h-4 w-4" />Back</button>{step < 4 ? <button type="button" onClick={continueFlow} className="inline-flex items-center gap-2 rounded-lg bg-slate-950 px-4 py-3 font-semibold text-white">Continue<ArrowRight className="h-4 w-4" /></button> : <button type="button" onClick={submit} className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-4 py-3 font-semibold text-white">Create project<CheckCircle2 className="h-4 w-4" /></button>}</div>
        </section>

        <div className="flex gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-950"><Database className="h-5 w-5 shrink-0" /><p><strong>Persistence boundary:</strong> projects remain in this browser for the current mock-auth workspace. Production Supabase persistence and RLS require a later governed slice.</p></div>
        <Link to={ROUTES.PROJECTS} className="font-semibold underline">Return to Project Register</Link>
      </section>
    </main>
  );
};
