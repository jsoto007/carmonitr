import { useAuth } from '../../context/AuthContext';
import { AppNavBar } from './AppNavBar';
import { PublicNavBar } from './PublicNavBar';

export const NavBarContainer = () => {
  const { currentStaff } = useAuth();
  return currentStaff ? <AppNavBar /> : <PublicNavBar />;
};
