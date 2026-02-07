import React, { useState } from 'react';
import { Calendar, CheckCircle, XCircle } from 'lucide-react';
import useFetch from '../hooks/useFetch';
import api from '../services/api';
import CommonNavbar from '../components/CommonNavbar';
import BackButton from '../components/BackButton';

export default function MarkAttendance() {
  const { data: students, loading } = useFetch('/admin/students', []);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [batching, setBatching] = useState(false);
  const [markingIds, setMarkingIds] = useState<string[]>([]);

  const mark = async (
    studentId: string,
    status: 'present' | 'absent' = 'present'
  ) => {
    try {
      setMarkingIds((s) => [...s, studentId]);
      await api.post('/admin/attendance/mark', {
        student_id: studentId,
        date,
        status,
      });
      // success - remove from markingIds
      setMarkingIds((s) => s.filter((id) => id !== studentId));
    } catch (e: any) {
      setMarkingIds((s) => s.filter((id) => id !== studentId));
      alert(e?.response?.data?.error || 'Error');
    }
  };

  const markAllPresent = async () => {
    if (!students || students.length === 0) return;
    if (!confirm(`Mark all ${students.length} students as present for ${date}?`)) return;
    setBatching(true);
    const ids = students.map((s: any) => s.id);
    setMarkingIds(ids);
    try {
      const promises = ids.map((studentId: string) =>
        api.post('/admin/attendance/mark', { student_id: studentId, date, status: 'present' })
      );
      const results = await Promise.allSettled(promises);
      const failed = results.reduce((acc: string[], r, i) => {
        if (r.status === 'rejected') acc.push(ids[i]);
        return acc;
      }, []);
      if (failed.length === 0) alert('All students marked present');
      else alert(`${failed.length} / ${ids.length} failed to mark`);
    } catch (err) {
      alert('Batch marking failed');
    } finally {
      setMarkingIds([]);
      setBatching(false);
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
        <div className="mb-4 flex justify-end">
          <button
            onClick={markAllPresent}
            disabled={batching}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-sm transition"
          >
            Mark All Present
          </button>
        </div>
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
                  disabled={markingIds.includes(s.id)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 text-sm transition disabled:opacity-50"
                >
                  <CheckCircle size={16} />
                  {markingIds.includes(s.id) ? 'Marking...' : 'Present'}
                </button>

                <button
                  onClick={() => mark(s.id, 'absent')}
                  disabled={markingIds.includes(s.id)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 text-sm transition disabled:opacity-50"
                >
                  <XCircle size={16} />
                  {markingIds.includes(s.id) ? 'Marking...' : 'Absent'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
