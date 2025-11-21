import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { PublicNavBar } from '../components/navigation/PublicNavBar';

export const SignUpPage = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { signup, error } = useAuth();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setStatus('Creating your workspace…');
    const success = await signup({
      full_name: fullName.trim(),
      email: email.trim(),
      password,
      account_name: company || undefined,
    });
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
          <p className="text-xs uppercase tracking-[0.6em] text-slate-500">Create account</p>
          <h1 className="text-3xl font-semibold text-white">Launch staffmonitr for your site</h1>
          <p className="text-sm text-slate-400">
            Invite admins, configure geofence boundaries, and publish compliant schedules for every role.
          </p>
        </div>
        <div className="flex flex-col gap-10 rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            <label className="block space-y-1 text-sm text-slate-300">
              Full name
              <input
                type="text"
                required
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                className="mt-1 w-full rounded-2xl border border-slate-800 bg-slate-950/70 px-4 py-3 text-sm text-white focus:border-brand-500 focus:outline-none"
              />
            </label>
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
              Organization or site name
              <input
                type="text"
                value={company}
                onChange={(event) => setCompany(event.target.value)}
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
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-2xl bg-gradient-to-r from-brand-500 to-brand-700 px-4 py-3 text-sm font-semibold uppercase tracking-[0.4em] text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? 'Creating workspace…' : 'Create workspace'}
          </button>
        </form>
        {(error || status) && (
          <p className={error ? 'text-xs text-red-400' : 'text-xs text-slate-500'}>{error || status}</p>
        )}
          <p className="text-xs text-slate-400">
            Already onboarded?{' '}
            <Link to="/signin" className="font-semibold text-white hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
