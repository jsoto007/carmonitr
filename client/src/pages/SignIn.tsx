import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { PublicNavBar } from '../components/navigation/PublicNavBar';

export const SignInPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { login, error } = useAuth();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setStatus('Signing you in…');
    const success = await login(email.trim(), password);
    setSubmitting(false);
    if (success) {
      navigate('/dashboard');
    } else {
      setStatus(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <PublicNavBar />
      <div className="mx-auto flex max-w-3xl flex-col gap-12 px-4 pb-16 pt-28 text-slate-100">
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.6em] text-slate-500">Sign in</p>
          <h1 className="text-3xl font-semibold text-white">Access your staff scheduling cockpit</h1>
          <p className="text-sm text-slate-400">
            Use industry-grade authentication, invite tokens, or SSO to keep account groups secure.
          </p>
        </div>
        <div className="flex flex-col gap-10 rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            <label className="block space-y-1 text-sm text-slate-300">
              Email
              <input
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="mt-1 w-full rounded-2xl border border-slate-800 bg-slate-950/70 px-4 py-3 text-sm text-white focus:border-brand-500 focus:outline-none"
              />
            </label>
            <label className="block space-y-1 text-sm text-slate-300">
              Password
              <input
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="mt-1 w-full rounded-2xl border border-slate-800 bg-slate-950/70 px-4 py-3 text-sm text-white focus:border-brand-500 focus:outline-none"
              />
            </label>
            <div className="flex items-center justify-between text-xs uppercase tracking-[0.4em] text-slate-500">
              <label className="flex items-center gap-2 text-xs tracking-[0.4em]">
                <input type="checkbox" className="h-3 w-3 rounded border-slate-600 bg-slate-800 text-brand-500 focus:ring-brand-500" />
                Remember me
              </label>
              <button type="button" className="text-slate-400 hover:text-white">
                Forgot password?
              </button>
            </div>
            <div className="flex items-center justify-between">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 rounded-2xl bg-gradient-to-r from-brand-500 to-brand-700 px-4 py-3 text-sm font-semibold uppercase tracking-[0.4em] text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? 'Signing in…' : 'Sign in'}
            </button>
            </div>
          </form>
          {(error || status) && (
            <p className={error ? 'text-xs text-red-400' : 'text-xs text-slate-500'}>{error || status}</p>
          )}
          <p className="text-xs text-slate-400">
            Need an account?{' '}
            <Link to="/signup" className="font-semibold text-white hover:underline">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
