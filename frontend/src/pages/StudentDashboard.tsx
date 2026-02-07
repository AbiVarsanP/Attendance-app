import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import useFetch from '../hooks/useFetch';
import { Bar } from 'react-chartjs-2';
import CommonNavbar from '../components/CommonNavbar';
import api from '../services/api';

function AttendanceTable(){
  const { data, loading } = useFetch('/student/attendance', []);
  if (loading) return <div>Loading...</div>;
  return (
    <div className="overflow-auto">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-4 py-2 text-left text-xs text-slate-500">Date</th>
            <th className="px-4 py-2 text-left text-xs text-slate-500">Status</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-slate-100">
          {data?.map((r:any)=> (
            <tr key={r.id}>
              <td className="px-4 py-2 text-sm">{r.date}</td>
              <td className="px-4 py-2 text-sm">{r.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function StudentDashboard(){
  const auth = useAuth();
  const { data, loading } = useFetch('/student/analytics', []);

  const weekly = data?.weekly || { percent: 0, present: 0, total: 0 };
  const monthly = data?.monthly || { percent: 0, present: 0, total: 0 };

  const chartData = {
    labels: ['Attendance %'],
    datasets: [
      { label: 'Weekly %', data: [weekly.percent || 0], backgroundColor: 'rgba(34,197,94,0.8)' },
      { label: 'Monthly %', data: [monthly.percent || 0], backgroundColor: 'rgba(59,130,246,0.8)' }
    ]
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <CommonNavbar title="Student Portal" subtitle="My Attendance" />

      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="mt-2">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Student Dashboard</h1>
              <div className="text-sm text-gray-600">Welcome{auth?.role ? ` (${auth.role})` : ''}</div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white p-4 rounded shadow">
              <h3 className="font-semibold mb-3">Attendance History</h3>
              {/* fetch attendance */}
              <AttendanceTable />
            </div>

            <div className="bg-white p-4 rounded shadow">
              <h3 className="font-semibold mb-3">Analytics</h3>
              {loading && <div>Loading...</div>}
              {!loading && (
                <div className="flex flex-col gap-4">
                  <div className="p-3 bg-green-50 rounded">
                    <div className="text-sm text-gray-500">Weekly %</div>
                    <div className="text-2xl font-bold">{Math.round((weekly.percent || 0) * 100)/100}%</div>
                  </div>
                  <div className="p-3 bg-blue-50 rounded">
                    <div className="text-sm text-gray-500">Monthly %</div>
                    <div className="text-2xl font-bold">{Math.round((monthly.percent || 0) * 100)/100}%</div>
                  </div>
                  <div>
                    <Bar data={chartData} />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
