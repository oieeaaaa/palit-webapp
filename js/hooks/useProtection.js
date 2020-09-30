import { useContext } from 'react';
import UserContext from 'js/contexts/user';
import LoadingScreen from 'components/loadingScreen/loadingScreen';

/**
 * useProtection.
 *
 * @param {object} Component
 */
const useProtection = (Component) => () => {
  const user = useContext(UserContext);

  if (!user.key) return <LoadingScreen />;

  return <Component />;
};

export default useProtection;
