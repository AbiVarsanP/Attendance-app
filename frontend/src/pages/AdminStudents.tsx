import React, { useState } from 'react';
import { UserPlus, Mail, Lock, Hash } from 'lucide-react';
import useFetch, { invalidateCache } from '../hooks/useFetch';
import CommonNavbar from '../components/CommonNavbar';
import ConfirmDialog from '../components/ConfirmDialog';
import BackButton from '../components/BackButton';
import StudentRow from '../components/StudentRow';
import api from '../services/api';

export default function AdminStudents() {
  const [reload, setReload] = useState(0);
  const { data, loading } = useFetch('/admin/students', [reload]);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [registerNumber, setRegisterNumber] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const startEdit = (student: any) => {
    setEditingId(student.id);
    setName(student.user?.name || '');
    setEmail(student.user?.email || '');
    setPassword('');
    setRegisterNumber(student.register_number || '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setName(''); setEmail(''); setPassword(''); setRegisterNumber('');
  };

  const [pendingEdit, setPendingEdit] = useState<any | null>(null);

  const submit = async (e: any) => {
    e.preventDefault();
    // If editing, show confirmation dialog before applying edits
    if (editingId) {
      setPendingEdit({ id: editingId, name, email, password: password || undefined, register_number: registerNumber });
      return;
    }
    try {
      await api.post('/admin/students', {
        name,
        email,
        password,
        register_number: registerNumber,
      });
      // invalidate cache and reload
      invalidateCache('/admin/students');
      setReload((r) => r + 1);
      setName('');
      setEmail('');
      setPassword('');
      setRegisterNumber('');
      alert('Student created');
    } catch (err: any) {
      alert(err?.response?.data?.error || 'Failed to create student');
    }
  };

  const confirmEdit = async () => {
    if (!pendingEdit) return;
    try {
      await api.put(`/admin/students/${pendingEdit.id}`, {
        name: pendingEdit.name,
        email: pendingEdit.email,
        password: pendingEdit.password || undefined,
        register_number: pendingEdit.register_number,
      });
      invalidateCache('/admin/students');
      setReload(r => r + 1);
      setName(''); setEmail(''); setPassword(''); setRegisterNumber('');
      setEditingId(null);
      alert('Student updated');
    } catch (err: any) {
      alert(err?.response?.data?.error || 'Update failed');
    }
    setPendingEdit(null);
  };

  const handleDelete = async (student: any) => {
    // show confirm dialog
    setPendingDelete(student);
  };

  const [pendingDelete, setPendingDelete] = useState<any | null>(null);

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    try {
      await api.delete(`/admin/students/${pendingDelete.id}`);
      invalidateCache('/admin/students');
      setReload(r => r + 1);
      alert('Deleted');
    } catch (e:any) { alert(e?.response?.data?.error || 'Delete failed'); }
    setPendingDelete(null);
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <CommonNavbar title="Attendance Admin" subtitle="Students" />
      <ConfirmDialog
        open={!!pendingDelete}
        title="Delete Student"
        description={pendingDelete ? `Delete student ${pendingDelete.user?.name || pendingDelete.id}? This cannot be undone.` : ''}
        confirmText="Delete"
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
      <ConfirmDialog
        open={!!pendingEdit}
        title="Confirm Edit"
        description={pendingEdit ? `Apply changes to ${pendingEdit.name || pendingEdit.id}?` : ''}
        confirmText="Apply"
        onConfirm={confirmEdit}
        onCancel={() => setPendingEdit(null)}
      />
      <main className="max-w-6xl mx-auto px-4 py-6">
        <BackButton />
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-slate-800">
            Students
          </h2>
          <p className="text-sm text-slate-500">
            Create and manage student accounts
          </p>
        </div>

        {/* Create Student */}
        <form
          onSubmit={submit}
          className="bg-white border border-slate-200 rounded-xl p-6 mb-8"
        >
          <div className="flex items-center gap-2 mb-4">
            <UserPlus className="text-blue-600" size={20} />
            <h3 className="font-medium text-slate-800">
              Create Student
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Name */}
            <div>
              <label className="text-sm text-slate-600">
                Name
              </label>
              <input
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Student Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            {/* Email */}
            <div>
              <label className="text-sm text-slate-600">
                Email
              </label>
              <div className="mt-1 flex items-center gap-2 rounded-lg border border-slate-300 px-3 focus-within:ring-2 focus-within:ring-blue-500">
                <Mail size={16} className="text-slate-400" />
                <input
                  className="w-full py-2 outline-none bg-transparent"
                  placeholder="student@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-sm text-slate-600">
                Password
              </label>
              <div className="mt-1 flex items-center gap-2 rounded-lg border border-slate-300 px-3 focus-within:ring-2 focus-within:ring-blue-500">
                <Lock size={16} className="text-slate-400" />
                <input
                  type="password"
                  className="w-full py-2 outline-none bg-transparent"
                  placeholder="Temporary password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {/* Register Number */}
            <div>
              <label className="text-sm text-slate-600">
                Register Number
              </label>
              <div className="mt-1 flex items-center gap-2 rounded-lg border border-slate-300 px-3 focus-within:ring-2 focus-within:ring-blue-500">
                <Hash size={16} className="text-slate-400" />
                <input
                  className="w-full py-2 outline-none bg-transparent"
                  placeholder="REG12345"
                  value={registerNumber}
                  onChange={(e) => setRegisterNumber(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="mt-6">
            <button
              type="submit"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg transition"
            >
              <UserPlus size={18} />
              Create Student
            </button>
          </div>
        </form>

        {/* Student List */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          {loading && (
            <div className="p-4 text-sm text-slate-500">
              Loading students...
            </div>
          )}

          {!loading && (!data || data.length === 0) && (
            <div className="p-4 text-sm text-slate-500">
              No students created yet.
            </div>
          )}

          {!loading &&
            data?.map((s: any) => (
              <StudentRow
                key={s.id}
                student={s}
                onEdit={startEdit}
                onDelete={handleDelete}
              />
            ))}
        </div>
      </main>
    </div>
  );
}
