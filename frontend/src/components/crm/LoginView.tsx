import React from 'react';
import { Briefcase, Check } from 'lucide-react';

interface LoginViewProps {
  authMode: 'login' | 'register';
  setAuthMode: (mode: 'login' | 'register') => void;
  authForm: any;
  setAuthForm: (form: any) => void;
  onSubmit: (e: React.FormEvent) => void;
  addToast: (type: 'success' | 'error' | 'info', msg: string) => void;
}

export default function LoginView({
  authMode,
  setAuthMode,
  authForm,
  setAuthForm,
  onSubmit,
  addToast
}: LoginViewProps) {
  const selectQuickAccount = (email: string) => {
    setAuthForm({ ...authForm, email, password: 'password' });
    addToast('info', `Credential filled for ${email}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden text-slate-800">
        <div className="bg-primary p-8 text-white text-center">
          <h1 className="text-2xl font-bold tracking-tight">CRM 360</h1>
          <p className="text-blue-100 mt-2 text-sm">Unified Platform for High-Performance Enterprise Sales</p>
        </div>

        <div className="p-8">
          <div className="flex border-b border-slate-100 mb-6">
            <button
              onClick={() => setAuthMode('login')}
              className={`flex-1 pb-3 font-semibold text-sm ${authMode === 'login' ? 'text-primary border-b-2 border-primary' : 'text-slate-400'}`}
            >
              Sign In
            </button>
            <button
              onClick={() => setAuthMode('register')}
              className={`flex-1 pb-3 font-semibold text-sm ${authMode === 'register' ? 'text-primary border-b-2 border-primary' : 'text-slate-400'}`}
            >
              Create Account
            </button>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            {authMode === 'register' && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Full Name</label>
                  <input
                    type="text" required
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary text-slate-800 bg-white"
                    placeholder="e.g. John Doe"
                    value={authForm.name}
                    onChange={e => setAuthForm({ ...authForm, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Phone Number</label>
                  <input
                    type="text" required
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary text-slate-800 bg-white"
                    placeholder="e.g. +1 (555) 0122"
                    value={authForm.phone}
                    onChange={e => setAuthForm({ ...authForm, phone: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Company Name</label>
                  <input
                    type="text" required
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary text-slate-800 bg-white"
                    placeholder="e.g. Wayne Enterprises"
                    value={authForm.company}
                    onChange={e => setAuthForm({ ...authForm, company: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Initial Role Selection</label>
                  <select
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary text-slate-800 bg-white"
                    value={authForm.role}
                    onChange={e => setAuthForm({ ...authForm, role: e.target.value })}
                  >
                    <option value="Super Admin">Super Admin (Full Access)</option>
                    <option value="Admin">Admin (Moderate Access)</option>
                    <option value="User">User (Assigned access only)</option>
                  </select>
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Email Address</label>
              <input
                type="email" required
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary text-slate-800 bg-white"
                placeholder="name@company.com"
                value={authForm.email}
                onChange={e => setAuthForm({ ...authForm, email: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Password</label>
              <input
                type="password" required
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary text-slate-800 bg-white"
                placeholder="••••••••"
                value={authForm.password}
                onChange={e => setAuthForm({ ...authForm, password: e.target.value })}
              />
            </div>

            {authMode === 'register' && (
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Confirm Password</label>
                <input
                  type="password" required
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary text-slate-800 bg-white"
                  placeholder="••••••••"
                  value={authForm.confirmPassword}
                  onChange={e => setAuthForm({ ...authForm, confirmPassword: e.target.value })}
                />
              </div>
            )}

            {authMode === 'login' && (
              <div className="flex items-center justify-between text-xs mt-2">
                <label className="flex items-center space-x-2 text-slate-500 cursor-pointer">
                  <input type="checkbox" className="rounded text-primary border-slate-300 focus:ring-0" />
                  <span>Remember me</span>
                </label>
                <a href="#" className="text-primary hover:underline">Forgot password?</a>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-primary hover:bg-primary-hover text-white rounded-xl py-3 text-sm font-semibold transition mt-6 cursor-pointer"
            >
              {authMode === 'login' ? 'Sign In to Dashboard' : 'Complete Registration'}
            </button>
          </form>

          <div className="relative flex py-5 items-center">
            <div className="flex-grow border-t border-slate-100"></div>
            <span className="flex-shrink mx-4 text-slate-400 text-xs uppercase tracking-wider">Demo Quick Access</span>
            <div className="flex-grow border-t border-slate-100"></div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => selectQuickAccount('superadmin@crm.com')}
              className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 rounded-lg py-2 text-xs font-medium transition cursor-pointer"
            >
              Super Admin
            </button>
            <button
              onClick={() => selectQuickAccount('admin@crm.com')}
              className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 rounded-lg py-2 text-xs font-medium transition cursor-pointer"
            >
              Admin
            </button>
            <button
              onClick={() => selectQuickAccount('user@crm.com')}
              className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 rounded-lg py-2 text-xs font-medium transition cursor-pointer"
            >
              Standard User
            </button>
          </div>
          <p className="text-center text-[10px] text-slate-400 mt-3">All quick login bypasses use password "password"</p>
        </div>
      </div>
    </div>
  );
}
