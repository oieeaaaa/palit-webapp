import {
  useEffect,
  useState,
  createContext,
} from 'react';
import firebaseApp from 'firebase/app';
import USER from 'js/models/user';
import useError from 'js/hooks/useError';
import { normalizeData } from 'js/utils';

const defaultUser = {
  key: '',
  avatar: '',
  firstName: '',
  lastName: '',
  email: '',
  messagerLink: '',
  phoneNumber: '',
  address: '',
};

// context
const UserContext = createContext(null);

/**
 * UserProvider.
 *
 * @param {object} props
   * @param {object} children
 */
export const UserProvider = ({ children }) => {
  const [displayError] = useError();
  const [user, setUser] = useState(defaultUser);

  /**
   * onAuthChanges.
   *
   * @param {object} value
   */
  const onAuthChanges = async (value) => {
    if (!value || user.key) return;

    try {
      const rawData = await USER.getOne(value.uid);

      setUser(normalizeData(rawData));
    } catch (err) {
      displayError(err);
    }
  };

  /**
   * useEffect.
   */
  useEffect(() => {
    const unsubscribe = firebaseApp.auth().onAuthStateChanged(onAuthChanges);

    return () => unsubscribe();
  }, []);

  return (
    <UserContext.Provider value={user}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
