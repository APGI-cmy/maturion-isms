import { useEffect, useState } from 'react';
export function ConnectivityIndicator() {
  const [online, setOnline] = useState(navigator.onLine);
  useEffect(() => {
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    return () => { window.removeEventListener('online', on); window.removeEventListener('offline', off); };
  }, []);
  if (online) return null;
  return <div role="alert" aria-live="polite" style={{background:'#f00',color:'#fff',padding:'4px 8px'}}>You are offline</div>;
}
