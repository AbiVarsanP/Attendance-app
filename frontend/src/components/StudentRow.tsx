import React from 'react';
import { User, CheckCircle, XCircle } from 'lucide-react';

export default function StudentRow({ student, onEdit, onDelete }: any) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 py-3 border-b border-slate-200 hover:bg-slate-50 transition">
      {/* Student Info */}
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-full bg-slate-100 text-slate-500">
          <User size={16} />
        </div>
        <div>
          <div className="font-medium text-slate-800">{student.user?.name || 'Unknown'}</div>
          <div className="text-sm text-slate-500">{student.register_number} · {student.user?.email}</div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 justify-end">
        <button
          onClick={() => onEdit && onEdit(student)}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 text-sm transition"
        >
          Edit
        </button>

        <button
          onClick={() => onDelete && onDelete(student)}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 text-sm transition"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
