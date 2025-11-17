import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ReactNode } from 'react';
import clsx from 'clsx';
import { useAccountContext } from '../context/AccountContext';
import { useAuth } from '../context/AuthContext';

const navigation = [
  { name: 'Dashboard', path: '/dashboard' },
  { name: 'Calendar', path: '/calendar' },
  { name: 'Kids & Assignments', path: '/kids' },
  { name: 'Open Shifts', path: '/open-shifts' },
];

export const Layout = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { accounts, selectedAccount, setSelectedAccount } = useAccountContext();
  const { currentStaff, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-900 bg-slate-900/80 sticky top-0 z-20">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <div>
          <p className="text-sm uppercase tracking-[0.4em] text-slate-500">Staffmonitr</p>
          <p className="text-2xl font-semibold text-white">Multi-tenant scheduling</p>
        </div>
        <div className="flex flex-col gap-2 text-sm text-slate-300 sm:flex-row sm:items-center">
          <select
            value={selectedAccount?.id}
            onChange={(event) => {
              const account = accounts.find((acc) => acc.id === event.target.value);
              if (account) {
                setSelectedAccount(account);
              }
            }}
            className="rounded-full border border-slate-800 bg-slate-900/60 px-3 py-1 text-xs uppercase tracking-[0.4em] text-slate-300 outline-none transition hover:border-slate-600"
          >
            {accounts.map((account) => (
              <option key={account.id} value={account.id}>
                {account.name}
              </option>
            ))}
          </select>
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-slate-800 px-3 py-1.5 text-xs uppercase tracking-[0.4em] text-slate-200">
              {currentStaff?.role ?? 'Visitor'}
            </span>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-full border border-slate-800 px-3 py-1 text-xs uppercase tracking-[0.4em] text-slate-300 hover:border-slate-600"
            >
              Logout
            </button>
          </div>
        </div>
        </div>
      </header>
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-6 lg:flex-row">
        <nav className="w-full rounded-2xl border border-slate-900 bg-slate-900/70 p-4 lg:w-64">
          <p className="text-sm font-semibold text-slate-400">Workspace</p>
          <div className="mt-4 space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={clsx(
                  'block rounded-xl px-3 py-2 text-sm font-medium transition-all',
                  location.pathname === item.path
                    ? 'bg-slate-800 text-white shadow-lg'
                    : 'text-slate-400 hover:text-white',
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </nav>
        <main className="flex-1 rounded-2xl border border-slate-900 bg-slate-900/60 p-6 shadow-2xl shadow-black/20">
          {children}
        </main>
      </div>
    </div>
  );
};
