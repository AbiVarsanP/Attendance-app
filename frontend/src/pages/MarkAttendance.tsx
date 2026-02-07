import React, { useState } from 'react';
import { Calendar, CheckCircle, XCircle } from 'lucide-react';
import useFetch from '../hooks/useFetch';
import api from '../services/api';
import CommonNavbar from '../components/CommonNavbar';
import BackButton from '../components/BackButton';
import ConfirmDialog from '../components/ConfirmDialog';

export default function MarkAttendance() {
  const { data: students, loading } = useFetch('/admin/students', []);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const { data: attendanceRecords } = useFetch(`/admin/attendance?date=${date}`, [date]);
  const [batching, setBatching] = useState(false);
  const [markingIds, setMarkingIds] = useState<string[]>([]);
  const [attendanceMap, setAttendanceMap] = useState<Record<string, 'present' | 'absent'>>({});

  const mark = async (
    studentId: string,
    status: 'present' | 'absent' = 'present'
  ) => {
    // If already marked differently, ask for confirmation to re-mark
    const existing = attendanceMap[studentId];
    if (existing && existing !== status) {
      setPendingRemark({ studentId, status });
      return;
    }
    try {
      setMarkingIds((s) => [...s, studentId]);
      await api.post('/admin/attendance/mark', {
        student_id: studentId,
        date,
        status,
      });
      // update local attendance map so UI reflects current status
      setAttendanceMap((m) => ({ ...m, [studentId]: status }));
      // success - remove from markingIds
      setMarkingIds((s) => s.filter((id) => id !== studentId));
    } catch (e: any) {
      setMarkingIds((s) => s.filter((id) => id !== studentId));
      alert(e?.response?.data?.error || 'Error');
    }
  };

  const [pendingRemark, setPendingRemark] = React.useState<{ studentId: string; status: 'present' | 'absent' } | null>(null);

  const confirmRemark = async () => {
    if (!pendingRemark) return;
    const { studentId, status } = pendingRemark;
    setPendingRemark(null);
    await mark(studentId, status);
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
      // update attendance map for successes
      const successIds = ids.filter((id) => !failed.includes(id));
      setAttendanceMap((m) => {
        const copy = { ...m } as Record<string, 'present' | 'absent'>;
        successIds.forEach((id) => { copy[id] = 'present'; });
        return copy;
      });
    } catch (err) {
      alert('Batch marking failed');
    } finally {
      setMarkingIds([]);
      setBatching(false);
    }
  };

  // when date changes, clear local attendanceMap so statuses reflect current date
  React.useEffect(() => {
    // populate attendanceMap from fetched records for the selected date
    if (attendanceRecords && Array.isArray(attendanceRecords)) {
      const map: Record<string, 'present' | 'absent'> = {};
      attendanceRecords.forEach((r: any) => {
        if (r && r.student_id && r.status) map[r.student_id] = r.status;
      });
      setAttendanceMap(map);
    } else {
      setAttendanceMap({});
    }
    setMarkingIds([]);
  }, [date, attendanceRecords]);

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
        <ConfirmDialog
          open={!!pendingRemark}
          title="Re-mark Attendance"
          description={pendingRemark ? `This student is already marked for ${date}. Do you want to change the mark to ${pendingRemark.status}?` : ''}
          confirmText="Re-mark"
          onConfirm={confirmRemark}
          onCancel={() => setPendingRemark(null)}
        />
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
                  className={
                    `inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition disabled:opacity-50 ` +
                    (attendanceMap[s.id] === 'present'
                      ? 'bg-green-600 text-white'
                      : 'bg-green-50 text-green-700 hover:bg-green-100')
                  }
                >
                  <CheckCircle size={16} />
                  {markingIds.includes(s.id) ? 'Marking...' : 'Present'}
                </button>

                <button
                  onClick={() => mark(s.id, 'absent')}
                  disabled={markingIds.includes(s.id)}
                  className={
                    `inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition disabled:opacity-50 ` +
                    (attendanceMap[s.id] === 'absent'
                      ? 'bg-red-600 text-white'
                      : 'bg-red-50 text-red-700 hover:bg-red-100')
                  }
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
