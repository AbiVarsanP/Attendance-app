import React, { useState } from 'react';
import { Calendar, CheckCircle, XCircle } from 'lucide-react';
import useFetch from '../hooks/useFetch';
import api from '../services/api';
import CommonNavbar from '../components/CommonNavbar';
import BackButton from '../components/BackButton';

export default function MarkAttendance() {
  const { data: students, loading } = useFetch('/admin/students', []);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));

  const mark = async (
    studentId: string,
    status: 'present' | 'absent' = 'present'
  ) => {
    try {
      await api.post('/admin/attendance/mark', {
        student_id: studentId,
        date,
        status,
      });
      alert('Marked');
    } catch (e: any) {
      alert(e?.response?.data?.error || 'Error');
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-slate-100">
        <CommonNavbar
          title="Attendance Admin"
          subtitle="Mark Attendance"
        />
        <main className="max-w-7xl mx-auto px-4 py-6 text-slate-500">
          Loading students...
        </main>
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-100">
      <CommonNavbar
        title="Attendance Admin"
        subtitle="Mark Attendance"
      />

      <main className="max-w-6xl mx-auto px-4 py-6">
        <BackButton />
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-slate-800">
            Mark Attendance
          </h2>
          <p className="text-sm text-slate-500">
            Select date and mark student attendance
          </p>
        </div>

        {/* Date Picker */}
        <div className="mb-6 flex items-center gap-3">
          <div className="flex items-center gap-2 text-slate-600">
            <Calendar size={18} />
            <span className="text-sm font-medium">Date</span>
          </div>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Student List */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          {students?.map((s: any) => (
            <div
              key={s.id}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 py-3 border-b border-slate-200 hover:bg-slate-50 transition"
            >
              {/* Student Info */}
              <div>
                <div className="font-medium text-slate-800">
                  {s.user?.name || 'Unknown'}
                </div>
                <div className="text-sm text-slate-500">
                  {s.register_number}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => mark(s.id, 'present')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 text-sm transition"
                >
                  <CheckCircle size={16} />
                  Present
                </button>

                <button
                  onClick={() => mark(s.id, 'absent')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 text-sm transition"
                >
                  <XCircle size={16} />
                  Absent
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
