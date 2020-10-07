import { useState, createContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import firebaseApp from 'firebase/app';
import USER from 'js/models/user';
import { normalizeData } from 'js/utils';

export const defaultValue = {
  isVerifyingUser: false,
};

export const AuthContext = createContext(defaultValue);

export const defaultUser = {
  key: '',
  avatar: '',
  firstName: '',
  lastName: '',
  email: '',
  messengerLink: '',
  phoneNumber: '',
  address: '',
};

/**
 * AuthProvider.
 *
 * @param {object}
   * @param {object|function} children
 */
export const AuthProvider = ({ children }) => {
  const [isVerifyingUser, setIsVerifyingUser] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [user, setUser] = useState(defaultUser);

  // custom hooks
  const router = useRouter();

  /**
   * verifyUser
   */
  const verifyUser = () => {
    setIsVerifyingUser(true);

    const unsubscribe = firebaseApp.auth().onAuthStateChanged(async (snapshot) => {
      const isLoggedIn = !!snapshot;
      const isUserInAuthPages = ['/signup', '/login'].includes(router.pathname);

      if (isLoggedIn) {
        try {
          const rawData = await USER.getOne(snapshot.uid);

          setUser(normalizeData(rawData));
          setIsVerified(true);
        } catch (err) {
          console.error(err);
        }
      } else {
        setUser(defaultUser);
        setIsVerified(false);

        if (!isUserInAuthPages) {
          router.push('/', '/');
        }
      }

      setIsVerifyingUser(false);
    });

    return unsubscribe;
  };

  useEffect(() => {
    const unsubscribe = verifyUser();

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ isVerifyingUser, isVerified, user }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
