import React from 'react';

type Props = {
  open: boolean;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmDialog({ open, title, description, confirmText = 'Confirm', cancelText = 'Cancel', onConfirm, onCancel }: Props){
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
      <div className="relative bg-white rounded-lg shadow-lg max-w-sm w-full p-6">
        <h3 className="text-lg font-semibold">{title || 'Confirm'}</h3>
        {description && <p className="text-sm text-slate-600 mt-2">{description}</p>}
        <div className="mt-4 flex justify-end gap-3">
          <button onClick={onCancel} className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700">{cancelText}</button>
          <button onClick={onConfirm} className="px-3 py-1.5 rounded-lg bg-red-600 text-white">{confirmText}</button>
        </div>
      </div>
    </div>
  );
}
