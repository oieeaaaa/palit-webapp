import { useContext } from 'react';
import AuthContext from 'js/contexts/auth';
import LoadingScreen from 'components/loadingScreen/loadingScreen';

/**
 * useProtection.
 *
 * @param {object} Component
 */
const useProtection = (Component) => () => {
  const auth = useContext(AuthContext);

  if (!auth.isVerified) {
    return <LoadingScreen />;
  }

  return <Component />;
};

export default useProtection;
