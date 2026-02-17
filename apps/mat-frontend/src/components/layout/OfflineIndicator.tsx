import { useState, useEffect } from 'react';

const OfflineIndicator = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) {
    return null;
  }

  return (
    <div 
      className="fixed top-0 left-0 right-0 bg-yellow-500 text-white px-4 py-2 text-center z-50"
      role="alert"
      aria-live="assertive"
    >
      <span className="font-semibold">Offline Mode:</span> You are currently offline. Changes will be synced when connection is restored.
    </div>
  );
};

export default OfflineIndicator;
