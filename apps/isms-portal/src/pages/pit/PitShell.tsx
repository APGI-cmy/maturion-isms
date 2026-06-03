import React from 'react';

interface PitShellProps {
  readonly title: string;
  readonly description: string;
  readonly state?: 'data' | 'empty' | 'loading' | 'permission-denied' | 'network-error';
}

const stateCopy: Record<NonNullable<PitShellProps['state']>, string> = {
  data: 'Runtime shell ready. Stage 12 feature content will be delivered through governed slices.',
  empty: 'No PIT records are available for this slice yet.',
  loading: 'Loading PIT runtime state.',
  'permission-denied': 'You do not have permission to view this PIT workspace area.',
  'network-error': 'The PIT workspace could not load live data. Try again later.',
};

export const PitShell: React.FC<PitShellProps> = ({ title, description, state = 'data' }) => {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-8 text-slate-950" data-testid="pit-shell">
      <section className="mx-auto max-w-5xl rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">PIT Stage 12 Slice 1</p>
        <h1 className="mt-3 text-3xl font-bold">{title}</h1>
        <p className="mt-3 max-w-3xl text-base text-slate-600">{description}</p>
        <div className="mt-8 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6" data-testid={`pit-state-${state}`}>
          <h2 className="text-lg font-semibold">Runtime state: {state}</h2>
          <p className="mt-2 text-sm text-slate-600">{stateCopy[state]}</p>
        </div>
      </section>
    </main>
  );
};
