import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateOrganisation, useUserProfile } from '../lib/hooks/useSettings';

export function OnboardingPage() {
  const navigate = useNavigate();
  const { data: profile, isLoading: profileLoading } = useUserProfile();
  const createOrganisation = useCreateOrganisation();

  const [step, setStep] = useState<1 | 2>(1);
  const [fullName, setFullName] = useState('');
  const [organisationName, setOrganisationName] = useState('');
  const [error, setError] = useState<string | null>(null);

  // If user already has an organisation, redirect to home
  useEffect(() => {
    if (!profileLoading && profile?.organisation_id) {
      navigate('/', { replace: true });
    }
  }, [profileLoading, profile, navigate]);

  if (profileLoading) {
    return (
      <div role="status" aria-live="polite" className="min-h-screen flex items-center justify-center">
        <span className="sr-only">Loading…</span>
      </div>
    );
  }

  function handleNameNext(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!fullName.trim()) {
      setError('Please enter your name.');
      return;
    }
    setStep(2);
  }

  async function handleCreateOrg(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await createOrganisation.mutateAsync({
        name: organisationName,
        ownerFullName: fullName,
      });
      navigate('/');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to create organisation');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold text-center text-gray-900 mb-2">
          Welcome to MAT
        </h1>
        <p className="text-center text-sm text-gray-500 mb-6">
          Step {step} of 2
        </p>

        {error && (
          <div role="alert" className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}

        {step === 1 && (
          <form className="space-y-4" onSubmit={handleNameNext}>
            <div>
              <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-1">
                Your name
              </label>
              <input
                type="text"
                id="full_name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Jane Smith"
                required
                aria-required="true"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              Next
            </button>
          </form>
        )}

        {step === 2 && (
          <form className="space-y-4" onSubmit={handleCreateOrg}>
            <div>
              <label htmlFor="organisation_name" className="block text-sm font-medium text-gray-700 mb-1">
                Organisation name
              </label>
              <input
                type="text"
                id="organisation_name"
                value={organisationName}
                onChange={(e) => setOrganisationName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Acme Corp"
                required
                aria-required="true"
              />
            </div>
            <button
              type="submit"
              disabled={createOrganisation.isPending}
              className="w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50"
            >
              {createOrganisation.isPending ? 'Creating…' : 'Create & Continue'}
            </button>
            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-full text-sm text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              ← Back
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
