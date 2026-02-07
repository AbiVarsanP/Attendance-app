import React, { useState, useRef } from 'react';
import { Mail, Lock, LogIn } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const auth = useAuth();
  const emailRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);
  const submitRef = useRef<HTMLButtonElement | null>(null);

  const submit = async (e: any) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', { email, password });
      const { token, user } = res.data;
      auth.login(token, user.role);
      if (user.role === 'admin') window.location.href = '/admin';
      else window.location.href = '/student';
    } catch (err: any) {
      alert(err?.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <form
        onSubmit={submit}
        className="w-full max-w-md bg-white rounded-xl shadow-lg p-8"
      >
          {/* Header */}
          <div className="text-center mb-6">
            <div className="mx-auto mb-3 h-12 w-12 flex items-center justify-center rounded-full bg-blue-600 text-white">
              <LogIn size={22} />
            </div>
            <h2 className="text-2xl font-semibold text-slate-800">Attendance Login</h2>
            <p className="text-sm text-slate-500">Sign in to your account</p>
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="text-sm font-medium text-slate-600">Email</label>
            <div className="mt-1 flex items-center gap-2 rounded-lg border border-slate-300 px-3 focus-within:ring-2 focus-within:ring-blue-500">
              <Mail className="text-slate-400" size={18} />
              <input
                ref={emailRef}
                className="w-full py-2 outline-none bg-transparent text-slate-800"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    passwordRef.current?.focus();
                  }
                }}
              />
            </div>
          </div>

          {/* Password */}
          <div className="mb-6">
            <label className="text-sm font-medium text-slate-600">Password</label>
            <div className="mt-1 flex items-center gap-2 rounded-lg border border-slate-300 px-3 focus-within:ring-2 focus-within:ring-blue-500">
              <Lock className="text-slate-400" size={18} />
              <input
                ref={passwordRef}
                type="password"
                className="w-full py-2 outline-none bg-transparent text-slate-800"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    // allow form submit to proceed instead of moving focus
                    return;
                  }
                }}
              />
            </div>
          </div>

          {/* Button */}
          <button
            ref={submitRef}
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition"
          >
            <LogIn size={18} />
            Login
          </button>

          {/* Footer */}
          <p className="mt-6 text-center text-xs text-slate-400">Simple Attendance System</p>
      </form>
    </div>
  );
}
