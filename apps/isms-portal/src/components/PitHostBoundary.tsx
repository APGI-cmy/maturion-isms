import { useEffect } from 'react';
import { buildCanonicalIsmsUrl, isPitModuleHost } from '@/lib/pitHostPolicy';

export const PitHostBoundary = () => {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (isPitModuleHost(window.location.hostname)) {
      window.location.replace(buildCanonicalIsmsUrl(window.location));
    }
  }, []);

  return null;
};
