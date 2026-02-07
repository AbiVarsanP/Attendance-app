import { useState, useEffect } from 'react';
import api from '../services/api';

// Simple in-memory cache keyed by URL to avoid refetching on route remounts.
const cache = new Map<string, any>();

export function invalidateCache(url: string) {
  cache.delete(url);
}

export function clearCache() {
  cache.clear();
}

export default function useFetch(url: string, deps: any[] = []){
  const [data, setData] = useState<any>(cache.has(url) ? cache.get(url) : null);
  const [loading, setLoading] = useState(!cache.has(url));
  const [error, setError] = useState<any>(null);

  useEffect(()=>{
    let mounted = true;

    // If we have cached data, show it immediately
    if (cache.has(url)) {
      setData(cache.get(url));
      setLoading(false);
    }

    // If caller did not pass deps (length === 0) and we already have cached data, skip network fetch
    if (cache.has(url) && deps.length === 0) {
      return () => { mounted = false };
    }

    // Otherwise fetch (this allows components that pass a reload token in deps to refresh the cache)
    setLoading(prev => (cache.has(url) ? false : true));
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
