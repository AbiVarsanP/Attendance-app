import React from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  ClipboardCheck,
  BarChart3,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import useFetch from '../hooks/useFetch';
import CommonNavbar from '../components/CommonNavbar';

export default function AdminDashboard() {
  const auth = useAuth();
  const { data: summary, loading } = useFetch('/admin/analytics/daily', []);

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Navbar */}
      <CommonNavbar title="Attendance Admin" subtitle="Dashboard" />

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Welcome */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-slate-800">
            Welcome, Admin
          </h2>
          <p className="text-sm text-slate-500">
            Manage students and attendance
          </p>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link
            to="/admin/students"
            className="group bg-white rounded-xl p-5 border border-slate-200 hover:border-blue-300 hover:shadow transition"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                <Users size={20} />
              </div>
              <div>
                <h3 className="font-medium text-slate-800">
                  Students
                </h3>
                <p className="text-sm text-slate-500">
                  Manage student accounts
                </p>
              </div>
            </div>
          </Link>

          <Link
            to="/admin/mark"
            className="group bg-white rounded-xl p-5 border border-slate-200 hover:border-green-300 hover:shadow transition"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-50 text-green-600">
                <ClipboardCheck size={20} />
              </div>
              <div>
                <h3 className="font-medium text-slate-800">
                  Mark Attendance
                </h3>
                <p className="text-sm text-slate-500">
                  Record daily attendance
                </p>
              </div>
            </div>
          </Link>

          <Link
            to="/admin/analytics"
            className="group bg-white rounded-xl p-5 border border-slate-200 hover:border-purple-300 hover:shadow transition"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-50 text-purple-600">
                <BarChart3 size={20} />
              </div>
              <div>
                <h3 className="font-medium text-slate-800">
                  Analytics
                </h3>
                <p className="text-sm text-slate-500">
                  Attendance insights
                </p>
              </div>
            </div>
          </Link>
        </div>

        {/* Daily Summary */}
        <div className="mt-8 bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="font-semibold text-slate-800 mb-4">
            Today’s Summary
          </h3>

          {loading && (
            <div className="text-sm text-slate-500">
              Loading summary...
            </div>
          )}

          {!loading && summary && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="rounded-lg bg-green-50 p-4">
                <div className="text-sm text-slate-600">
                  Present
                </div>
                <div className="text-2xl font-semibold text-green-700">
                  {summary.present}
                </div>
              </div>

              <div className="rounded-lg bg-red-50 p-4">
                <div className="text-sm text-slate-600">
                  Absent
                </div>
                <div className="text-2xl font-semibold text-red-700">
                  {summary.absent}
                </div>
              </div>

              <div className="rounded-lg bg-slate-50 p-4">
                <div className="text-sm text-slate-600">
                  Date
                </div>
                <div className="text-lg font-semibold text-slate-800">
                  {summary.date}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
