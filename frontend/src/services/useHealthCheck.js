import { useEffect, useState } from 'react';
import api from './api';
export default function useHealthCheck() {
  const [status, setStatus] = useState('checking'); // 'ok' | 'error' | 'checking'

  useEffect(() => {
    const check = async () => {
      try {
        const res = await api.get('/api/health');
        setStatus(res.data.db === 'connected' ? 'ok' : 'error');
      } catch (err) {
        setStatus('error');
      }
    };
    check();

    const interval = setInterval(check, 10000); // check every 10s
    return () => clearInterval(interval);
  }, []);

  return status;
}
