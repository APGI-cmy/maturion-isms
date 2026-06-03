import React from 'react';

interface PitErrorBoundaryState {
  readonly hasError: boolean;
}

export class PitErrorBoundary extends React.Component<React.PropsWithChildren, PitErrorBoundaryState> {
  state: PitErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): PitErrorBoundaryState {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="min-h-screen bg-slate-50 px-6 py-8 text-slate-950">
          <section className="mx-auto max-w-3xl rounded-2xl border border-red-200 bg-white p-8 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-wide text-red-600">PIT runtime boundary</p>
            <h1 className="mt-3 text-2xl font-bold">Something went wrong</h1>
            <p className="mt-3 text-slate-600">The PIT route shell caught a runtime error instead of rendering a white screen.</p>
          </section>
        </main>
      );
    }

    return this.props.children;
  }
}
