import React from 'react';
import { LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

type Props = {
  title?: string;
  subtitle?: string;
};

export default function CommonNavbar({ title = 'Attendance', subtitle = '' }: Props){
  const auth = useAuth();
  return (
    <nav className="bg-white/80 backdrop-blur border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-slate-800">{title}</h1>
          {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-3">
          <button onClick={auth.logout} className="flex items-center gap-2 text-sm text-slate-600 hover:text-red-600 transition">
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </div>
    </nav>
  )
}
