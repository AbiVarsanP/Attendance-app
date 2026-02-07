import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Users, Percent } from 'lucide-react';
import { Bar, Doughnut } from 'react-chartjs-2';
import api from '../services/api';
import CommonNavbar from '../components/CommonNavbar';
import BackButton from '../components/BackButton';

export default function AdminAnalytics() {
  const [summary, setSummary] = useState<any>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [studentsStats, setStudentsStats] = useState<any[]>([]);
  const [weeklySummary, setWeeklySummary] = useState<any>(null);
  const [monthlySummary, setMonthlySummary] = useState<any>(null);
  const [chartPeriod, setChartPeriod] = useState<'week' | 'month'>('week');

  useEffect(() => {
    api
      .get('/admin/analytics/daily')
      .then((r) => setSummary(r.data))
      .catch(() => {});

    // fetch students and their analytics
    api.get('/admin/students').then((r) => {
      setStudents(r.data || []);
    });
    api.get('/admin/analytics/weekly').then((r) => setWeeklySummary(r.data)).catch(()=>{});
    api.get('/admin/analytics/monthly').then((r) => setMonthlySummary(r.data)).catch(()=>{});
  }, []);

  useEffect(() => {
    if (!students || students.length === 0) return;
    Promise.all(
      students.map((s) =>
        api
          .get(`/admin/analytics/student/${s.id}`)
          .then((r) => ({ student: s, stats: r.data }))
          .catch(() => ({ student: s, stats: null }))
      )
    ).then((arr) => setStudentsStats(arr));
  }, [students]);

  const total = summary ? summary.present + summary.absent : 0;
  const percentage =
    summary && total > 0
      ? Math.round((summary.present / total) * 100)
      : 0;

  return (
    <div className="min-h-screen bg-slate-100">
      <CommonNavbar title="Attendance Admin" subtitle="Analytics" />

      <main className="max-w-7xl mx-auto px-4 py-6">
        <BackButton />
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-slate-800">
            Attendance Analytics
          </h2>
          <p className="text-sm text-slate-500">Student-wise attendance</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white border border-slate-200 rounded-xl p-4">
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle size={18} />
              <span className="text-sm font-medium">Present</span>
            </div>
            <div className="text-2xl font-semibold text-slate-800 mt-2">
              {summary ? summary.present : '-'}
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4">
            <div className="flex items-center gap-2 text-red-600">
              <XCircle size={18} />
              <span className="text-sm font-medium">Absent</span>
            </div>
            <div className="text-2xl font-semibold text-slate-800 mt-2">
              {summary ? summary.absent : '-'}
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4">
            <div className="flex items-center gap-2 text-blue-600">
              <Users size={18} />
              <span className="text-sm font-medium">Total Students</span>
            </div>
            <div className="text-2xl font-semibold text-slate-800 mt-2">
              {summary ? total : '-'}
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4">
            <div className="flex items-center gap-2 text-purple-600">
              <Percent size={18} />
              <span className="text-sm font-medium">Attendance %</span>
            </div>
            <div className="text-2xl font-semibold text-slate-800 mt-2">
              {summary ? `${percentage}%` : '-'}
            </div>
          </div>
        </div>

        {/* Student-wise analytics: table view */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">Register #</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-slate-500">Week (present/total)</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-slate-500">Week %</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-slate-500">Month (present/total)</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-slate-500">Month %</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-100">
              {studentsStats.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-sm text-slate-500 text-center">Loading student analytics...</td>
                </tr>
              )}

              {studentsStats.map((item: any) => {
                const s = item.student;
                const stats = item.stats || {};
                const weekly = stats.weekly || { total: 0, present: 0, percent: 0 };
                const monthly = stats.monthly || { total: 0, present: 0, percent: 0 };
                return (
                  <tr key={s.id}>
                    <td className="px-4 py-3 text-sm text-slate-800">{s.user?.name || 'Unnamed'}</td>
                    <td className="px-4 py-3 text-sm text-slate-500">{s.register_number || '-'}</td>
                    <td className="px-4 py-3 text-sm text-center">{weekly.present}/{weekly.total}</td>
                    <td className="px-4 py-3 text-sm text-center">{Math.round(weekly.percent || 0)}%</td>
                    <td className="px-4 py-3 text-sm text-center">{monthly.present}/{monthly.total}</td>
                    <td className="px-4 py-3 text-sm text-center">{Math.round(monthly.percent || 0)}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Overall period chart (compact) */}
        <div className="mt-6 bg-white border border-slate-200 rounded-xl p-6 flex flex-col md:flex-row items-center gap-6">
          <div className="flex-1">
            <h3 className="font-medium text-slate-800 mb-3">Overall Period Summary</h3>
            <div className="flex items-center gap-3">
              <button onClick={() => setChartPeriod('week')} className={`px-3 py-1 rounded ${chartPeriod === 'week' ? 'bg-blue-600 text-white' : 'bg-slate-100'}`}>Weekly</button>
              <button onClick={() => setChartPeriod('month')} className={`px-3 py-1 rounded ${chartPeriod === 'month' ? 'bg-blue-600 text-white' : 'bg-slate-100'}`}>Monthly</button>
            </div>
            <div className="mt-4 max-w-xs">
              {chartPeriod === 'week' && weeklySummary && (
                <Doughnut
                  data={{ labels: ['Present', 'Absent'], datasets: [{ data: [weeklySummary.present, weeklySummary.absent], backgroundColor: ['#22c55e', '#ef4444'] }] }}
                  options={{ plugins: { legend: { position: 'bottom' } }, maintainAspectRatio: true }}
                />
              )}

              {chartPeriod === 'month' && monthlySummary && (
                <Doughnut
                  data={{ labels: ['Present', 'Absent'], datasets: [{ data: [monthlySummary.present, monthlySummary.absent], backgroundColor: ['#22c55e', '#ef4444'] }] }}
                  options={{ plugins: { legend: { position: 'bottom' } }, maintainAspectRatio: true }}
                />
              )}

              {!weeklySummary && !monthlySummary && (
                <div className="text-sm text-slate-500">Loading period summaries...</div>
              )}
            </div>
          </div>

          <div className="w-full md:w-1/3">
            <div className="bg-slate-50 p-4 rounded-lg">
              <div className="text-sm text-slate-600">Summary</div>
              <div className="mt-2 text-lg font-semibold text-slate-800">Present: {chartPeriod === 'week' ? (weeklySummary?.present ?? '-') : (monthlySummary?.present ?? '-')}</div>
              <div className="text-sm text-slate-500">Absent: {chartPeriod === 'week' ? (weeklySummary?.absent ?? '-') : (monthlySummary?.absent ?? '-')}</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
