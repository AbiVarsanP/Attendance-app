import { useState, useEffect } from 'react';
import api from '../services/api';

export default function useFetch(url: string, deps: any[] = []){
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(()=>{
    let mounted = true;
    setLoading(true);
    api.get(url).then(r=>{ if(mounted){ setData(r.data); setLoading(false); } }).catch(e=>{ if(mounted){ setError(e); setLoading(false);} });
    return ()=>{ mounted=false };
  }, deps);

  return { data, loading, error };
}
