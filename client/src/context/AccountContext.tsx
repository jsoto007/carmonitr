import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { AccountGroup } from '../types';
import { useAuth } from './AuthContext';

const defaultAccount: AccountGroup = {
  id: 'site-101',
  name: 'Blue Harbor Intake',
  branding: {
    primaryColor: '#3b82f6',
  },
  geofence: {
    lat: 34.0522,
    lon: -118.2437,
    radiusMeters: 450,
  },
};

interface AccountContextValue {
  selectedAccount: AccountGroup;
  setSelectedAccount: (account: AccountGroup) => void;
  accounts: AccountGroup[];
}

const AccountContext = createContext<AccountContextValue | undefined>(undefined);

export const AccountProvider = ({ children }: { children: React.ReactNode }) => {
  const { accounts: authAccounts } = useAuth();
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(authAccounts[0]?.id ?? defaultAccount.id);

  useEffect(() => {
    if (!authAccounts.length) {
      setSelectedAccountId((prev) => prev ?? defaultAccount.id);
      return;
    }
    if (!selectedAccountId || !authAccounts.some((account) => account.id === selectedAccountId)) {
      setSelectedAccountId(authAccounts[0].id);
    }
  }, [authAccounts, selectedAccountId]);

  const availableAccounts = authAccounts.length ? authAccounts : [defaultAccount];
  const selectedAccount =
    availableAccounts.find((account) => account.id === selectedAccountId) ?? availableAccounts[0];

  const value = useMemo(
    () => ({
      selectedAccount,
      setSelectedAccount: (account: AccountGroup) => setSelectedAccountId(account.id),
      accounts: availableAccounts,
    }),
    [availableAccounts, selectedAccount],
  );

  return <AccountContext.Provider value={value}>{children}</AccountContext.Provider>;
};

export const useAccountContext = () => {
  const ctx = useContext(AccountContext);
  if (!ctx) throw new Error('AccountProvider missing');
  return ctx;
};
