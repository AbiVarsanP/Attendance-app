import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function BackButton(){
  const navigate = useNavigate();
  return (
    <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-800 mb-4">
      <ArrowLeft size={16} />
      Back
    </button>
  );
}
