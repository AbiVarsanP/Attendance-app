import React, { useState } from 'react';
import { LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import ConfirmDialog from './ConfirmDialog';

type Props = {
  title?: string;
  subtitle?: string;
};

export default function CommonNavbar({ title = 'Attendance', subtitle = '' }: Props){
  const auth = useAuth();
  const [confirmOpen, setConfirmOpen] = useState(false);
  return (
    <>
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-slate-800">{title}</h1>
            {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setConfirmOpen(true)} className="flex items-center gap-2 text-sm text-slate-600 hover:text-red-600 transition">
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      </nav>
      <ConfirmDialog
        open={confirmOpen}
        title="Logout"
        description="Are you sure you want to logout?"
        confirmText="Logout"
        onConfirm={() => { setConfirmOpen(false); auth.logout(); }}
        onCancel={() => setConfirmOpen(false)}
      />
    </>
  )
}
