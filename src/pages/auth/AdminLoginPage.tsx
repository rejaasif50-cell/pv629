import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldCheck,
  Lock,
  Mail,
  ArrowRight,
  AlertCircle,
  KeyRound,
  CheckCircle2
} from 'lucide-react';

export const AdminLoginPage: React.FC = () => {
  const { login, navigate, showToast } = useApp();

  const [email, setEmail] = useState('admin@rezaenterprise.com');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const user = await login(email, password);
      if (user.role !== 'admin') {
        setError('Unauthorized: this account does not have Admin privileges.');
        return;
      }
      showToast('Welcome to Reza Enterprise Admin Dashboard', 'success');
      navigate('admin-dashboard');
    } catch (err: any) {
      setError(err?.message || 'Invalid admin credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = () => {
    setEmail('admin@rezaenterprise.com');
    setPassword('admin123');
    setError(null);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-slate-900 rounded-3xl border border-slate-800 p-8 shadow-2xl text-white space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-blue-500/30">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-400 bg-blue-950/80 px-2.5 py-1 rounded">
            Administrative Access
          </span>
          <h1 className="text-2xl font-black tracking-tight">Admin Control Panel</h1>
          <p className="text-xs text-slate-400">
            Reza Enterprise PVC Printing operations & dispatch management
          </p>
        </div>

        {/* Demo Credentials Helper */}
        <div className="p-3.5 bg-slate-800/80 rounded-2xl border border-slate-700/80 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-300 font-semibold flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-amber-400" />
              Default Admin Credentials:
            </span>
            <button
              type="button"
              onClick={handleFillDemo}
              className="text-[11px] font-bold text-blue-400 hover:text-blue-300 underline"
            >
              Fill Demo
            </button>
          </div>
          <p className="font-mono text-[11px] text-slate-300">
            Email: <span className="text-white font-bold">admin@rezaenterprise.com</span>
            <br />
            Password: <span className="text-white font-bold">admin123</span>
          </p>
        </div>

        {error && (
          <div className="p-3 bg-rose-950/60 border border-rose-800 rounded-xl text-xs text-rose-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="admin-login-email"
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              Admin Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="admin-login-password"
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <button
            id="btn-admin-submit"
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 text-white font-extrabold py-3.5 px-4 rounded-xl text-sm transition-all shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Enter Admin Console</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-slate-800 text-xs text-slate-400">
          Not an administrator?{' '}
          <button
            onClick={() => navigate('login')}
            className="text-blue-400 font-bold hover:underline"
          >
            Customer Login
          </button>
        </div>
      </div>
    </div>
  );
};
