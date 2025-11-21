import { Transition } from '@headlessui/react';
import {
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  CalendarDaysIcon,
  HomeIcon,
  MegaphoneIcon,
  ShieldCheckIcon,
  UserGroupIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { Fragment, useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAccountContext } from '../../context/AccountContext';
import { useAuth } from '../../context/AuthContext';

type NavItem = {
  to: string;
  label: string;
  description?: string;
  Icon: typeof HomeIcon;
};

const NAV_ITEMS: NavItem[] = [
  {
    to: '/dashboard',
    label: 'Dashboard',
    description: 'Live staffing and ratios',
    Icon: HomeIcon,
  },
  {
    to: '/calendar',
    label: 'Calendar',
    description: 'Publish shifts & geofences',
    Icon: CalendarDaysIcon,
  },
  {
    to: '/kids',
    label: 'Kids & Assignments',
    description: 'Pair staff with every kid',
    Icon: UserGroupIcon,
  },
  {
    to: '/open-shifts',
    label: 'Open Shifts',
    description: 'Broadcast & approvals',
    Icon: MegaphoneIcon,
  },
];

const ADMIN_ROLES = new Set(['Owner_admin', 'Admin']);

export const AppNavBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentStaff, logout } = useAuth();
  const { accounts, selectedAccount, setSelectedAccount } = useAccountContext();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname, location.search]);

  const isActive = (path: string) => {
    const normalized = path.replace(/\/+$/, '');
    const current = location.pathname.replace(/\/+$/, '');
    return current === normalized || current.startsWith(`${normalized}/`);
  };

  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  const isAdmin = ADMIN_ROLES.has(currentStaff?.role ?? '');
  const roleLabel = currentStaff?.role ?? 'Visitor';
  const CtaIcon = isAdmin ? CalendarDaysIcon : MegaphoneIcon;
  const cta = useMemo(
    () =>
      isAdmin
        ? { to: '/calendar', label: 'Publish shifts' }
        : { to: '/open-shifts', label: 'Find open shifts' },
    [isAdmin],
  );

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center justify-between gap-3 rounded-full border border-white/50 bg-white/90 px-4 py-2 shadow-lg backdrop-blur-xl transition dark:border-slate-800 dark:bg-slate-900/80">
          <Link
            to="/dashboard"
            className="flex items-center gap-3 rounded-full px-2 py-1 text-slate-900 transition hover:text-indigo-600 dark:text-white"
          >
            <span className="inline-flex size-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500/20 via-sky-500/25 to-blue-500/20 text-base font-semibold text-indigo-700 shadow-inner dark:text-indigo-200">
              SM
            </span>
            <span className="hidden sm:inline font-heading text-lg font-semibold tracking-tight">StaffMonitr</span>
            <span className="hidden text-xs uppercase tracking-[0.35em] text-slate-500 sm:inline">
              Compliance scheduling
            </span>
          </Link>

          <nav className="hidden items-center gap-1 text-sm font-medium text-slate-800 dark:text-slate-200 md:flex">
            {NAV_ITEMS.map(({ to, label, Icon }) => (
              <Link
                key={to}
                to={to}
                className={clsx(
                  'flex items-center gap-2 rounded-full px-3 py-2 transition duration-150',
                  isActive(to)
                    ? 'bg-indigo-50 text-indigo-700 shadow-inner ring-1 ring-indigo-200 dark:bg-indigo-500/10 dark:text-indigo-100 dark:ring-indigo-300/30'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-indigo-700 dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-indigo-100',
                )}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                <span>{label}</span>
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-2 sm:flex">
            <div className="hidden items-center gap-2 lg:flex">
              <label className="sr-only" htmlFor="account-switcher">
                Switch account
              </label>
              <select
                id="account-switcher"
                value={selectedAccount.id}
                onChange={(event) => {
                  const next = accounts.find((account) => account.id === event.target.value);
                  if (next) setSelectedAccount(next);
                }}
                className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.35em] text-slate-700 outline-none transition hover:border-indigo-300 focus-visible:border-indigo-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              >
                {accounts.map((account) => (
                  <option key={account.id} value={account.id}>
                    {account.name}
                  </option>
                ))}
              </select>
              <span
                className={clsx(
                  'inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.35em]',
                  isAdmin
                    ? 'border-amber-200/60 bg-amber-50 text-amber-800 dark:border-amber-400/30 dark:bg-amber-500/15 dark:text-amber-100'
                    : 'border-slate-200 bg-slate-100 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200',
                )}
              >
                <ShieldCheckIcon className="h-4 w-4" aria-hidden="true" />
                {roleLabel}
              </span>
            </div>

            <Link
              to={cta.to}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-600 via-indigo-500 to-sky-500 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-indigo-500/30 transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              <CtaIcon className="h-4 w-4" aria-hidden="true" />
              <span>{cta.label}</span>
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-indigo-200 hover:text-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-indigo-400/60 dark:hover:text-indigo-100"
            >
              <ArrowRightOnRectangleIcon className="h-4 w-4" aria-hidden="true" />
              <span>Logout</span>
            </button>
          </div>

          <button
            type="button"
            className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white/90 p-2 text-slate-700 transition hover:border-indigo-300 hover:text-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-200 dark:hover:border-indigo-400/60 dark:hover:text-indigo-100 md:hidden"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-nav-menu"
          >
            <span className="sr-only">{mobileMenuOpen ? 'Close menu' : 'Open menu'}</span>
            {mobileMenuOpen ? <XMarkIcon className="h-5 w-5" aria-hidden="true" /> : <Bars3Icon className="h-5 w-5" aria-hidden="true" />}
          </button>
        </div>
      </div>

      <Transition
        show={mobileMenuOpen}
        as={Fragment}
        enter="transition ease-out duration-150"
        enterFrom="opacity-0 -translate-y-1"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in duration-125"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 -translate-y-1"
      >
        <div id="mobile-nav-menu" className="md:hidden">
          <div className="mx-auto mt-3 max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-3xl border border-slate-200 bg-white/95 p-4 shadow-xl backdrop-blur-lg dark:border-slate-800 dark:bg-slate-900/90">
              <div className="space-y-1">
                {NAV_ITEMS.map(({ to, label, Icon }) => (
                  <Link
                    key={to}
                    to={to}
                    onClick={() => setMobileMenuOpen(false)}
                    className={clsx(
                      'flex items-center gap-3 rounded-2xl px-3.5 py-3 text-sm font-semibold transition duration-150',
                      isActive(to)
                        ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-100'
                        : 'text-slate-800 hover:bg-slate-100 dark:text-slate-100 dark:hover:bg-white/5',
                    )}
                  >
                    <Icon className="h-5 w-5" aria-hidden="true" />
                    <span>{label}</span>
                  </Link>
                ))}
              </div>

              <div className="mt-4 rounded-2xl border border-slate-200/70 bg-slate-50/80 p-3 dark:border-white/5 dark:bg-white/5">
                <label className="sr-only" htmlFor="mobile-account-switcher">
                  Switch account
                </label>
                <select
                  id="mobile-account-switcher"
                  value={selectedAccount.id}
                  onChange={(event) => {
                    const next = accounts.find((account) => account.id === event.target.value);
                    if (next) setSelectedAccount(next);
                  }}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 transition hover:border-indigo-300 focus-visible:border-indigo-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                >
                  {accounts.map((account) => (
                    <option key={account.id} value={account.id}>
                      {account.name}
                    </option>
                  ))}
                </select>

                <div
                  className={clsx(
                    'mt-3 inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold uppercase tracking-[0.35em]',
                    isAdmin
                      ? 'bg-amber-50 text-amber-800 ring-1 ring-amber-200/70 dark:bg-amber-500/15 dark:text-amber-100'
                      : 'bg-slate-100 text-slate-700 ring-1 ring-slate-200 dark:bg-slate-800 dark:text-slate-200',
                  )}
                >
                  <ShieldCheckIcon className="h-4 w-4" aria-hidden="true" />
                  {roleLabel}
                </div>
              </div>

              <div className="mt-4 space-y-3">
                <Link
                  to={cta.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-sky-500 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-indigo-500/30 transition hover:shadow-lg"
                >
                  <CtaIcon className="h-4 w-4" aria-hidden="true" />
                  <span>{cta.label}</span>
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-200 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
                >
                  <ArrowRightOnRectangleIcon className="h-4 w-4" aria-hidden="true" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </header>
  );
};
