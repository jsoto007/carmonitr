import { Link, useLocation } from 'react-router-dom';
import { ReactNode } from 'react';
import clsx from 'clsx';
import { NavBarContainer } from './navigation/NavBarContainer';

const navigation = [
  { name: 'Dashboard', path: '/dashboard' },
  { name: 'Calendar', path: '/calendar' },
  { name: 'Kids & Assignments', path: '/kids' },
  { name: 'Open Shifts', path: '/open-shifts' },
];

export const Layout = ({ children }: { children: ReactNode }) => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <NavBarContainer />
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 pb-10 pt-28 lg:flex-row">
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
