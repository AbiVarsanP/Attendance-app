import { useState, useEffect } from 'react';
import api from '../services/api';

// Simple in-memory cache keyed by URL to avoid refetching on route remounts.
const cache = new Map<string, any>();

export default function useFetch(url: string, deps: any[] = []){
  const [data, setData] = useState<any>(cache.has(url) ? cache.get(url) : null);
  const [loading, setLoading] = useState(!cache.has(url));
  const [error, setError] = useState<any>(null);

  useEffect(()=>{
    let mounted = true;
    // If cached and caller didn't request reload via deps, use cache and skip network.
    if (cache.has(url) && deps.length === 0) {
      setData(cache.get(url));
      setLoading(false);
      return () => { mounted = false };
    }

    setLoading(true);
    api.get(url)
      .then(r=>{
        if (!mounted) return;
        cache.set(url, r.data);
        setData(r.data);
        setLoading(false);
      })
      .catch(e=>{
        if (!mounted) return;
        setError(e);
        setLoading(false);
      });

    return ()=>{ mounted=false };
  }, deps);

  return { data, loading, error };
}
