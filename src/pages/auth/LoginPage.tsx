import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  CreditCard,
  Mail,
  Lock,
  ArrowRight,
  ShieldCheck,
  UserCheck,
  AlertCircle,
  Eye,
  EyeOff
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, navigate, showToast } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const user = await login(email, password);
      if (user.role === 'admin') {
        navigate('admin-dashboard');
      } else {
        navigate('customer-dashboard');
      }
    } catch (err: any) {
      setError(err?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  // Demo Login Helpers
  const handleQuickCustomerLogin = async () => {
    setEmail('customer@demo.com');
    setPassword('customer123');
    setLoading(true);
    try {
      await login('customer@demo.com', 'customer123');
      navigate('customer-dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAdminLogin = async () => {
    setEmail('admin@rezaenterprise.com');
    setPassword('admin123');
    setLoading(true);
    try {
      await login('admin@rezaenterprise.com', 'admin123');
      navigate('admin-dashboard');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center mx-auto shadow-md shadow-blue-500/20">
            <CreditCard className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Customer Login
          </h1>
          <p className="text-xs text-slate-500">
            Access your orders, track shipments, and re-order PVC cards
          </p>
        </div>

        {/* Quick Demo Access Bar */}
        <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-2xl space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-800 block text-center">
            ⚡ Quick Demo Logins
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleQuickCustomerLogin}
              className="py-1.5 px-2 bg-white hover:bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold rounded-xl transition-colors text-center shadow-2xs"
            >
              Customer Demo
            </button>
            <button
              type="button"
              onClick={handleQuickAdminLogin}
              className="py-1.5 px-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors text-center shadow-2xs"
            >
              Admin Demo
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="login-email"
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="youremail@example.com"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-bold text-slate-700">Password</label>
              <button
                type="button"
                onClick={() => showToast('Password reset link sent if account exists', 'info')}
                className="text-[11px] text-blue-600 hover:underline"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-slate-400 hover:text-slate-600 absolute right-3 top-1/2 -translate-y-1/2"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            id="btn-login-submit"
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-extrabold py-3 px-4 rounded-xl text-sm transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            {loading ? (
              <span>Signing in...</span>
            ) : (
              <>
                <span>Sign In to Account</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-slate-100 text-xs text-slate-500">
          Don&apos;t have an account yet?{' '}
          <button
            onClick={() => navigate('register')}
            className="text-blue-600 font-bold hover:underline"
          >
            Register Now
          </button>
        </div>

        <div className="pt-1 text-center">
          <button
            onClick={() => navigate('admin-login')}
            className="text-[11px] text-slate-400 hover:text-slate-700 flex items-center justify-center gap-1 mx-auto"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Admin Portal Login</span>
          </button>
        </div>
      </div>
    </div>
  );
};
