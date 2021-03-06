import { useState, createContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import firebaseApp from 'firebase/app';
import USER from 'js/models/user';
import { publicRoutes } from 'js/routes';
import { normalizeData } from 'js/utils';
import { gotoHome } from 'js/helpers/router';

export const defaultValue = {
  isVerifyingUser: false,
};

export const AuthContext = createContext(defaultValue);

/**
 * AuthProvider.
 *
 * @param {object}
   * @param {object|function} children
 */
export const AuthProvider = ({ children }) => {
  const [isVerifyingUser, setIsVerifyingUser] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [user, setUser] = useState(USER.defaultUser);

  // custom hooks
  const router = useRouter();

  /**
   * verifyUser
   */
  const verifyUser = () => {
    setIsVerifyingUser(true);

    const unsubscribe = firebaseApp.auth().onAuthStateChanged(async (snapshot) => {
      const isLoggedIn = !!snapshot;
      const isUserInAllowedPages = publicRoutes.some(
        (publicRoute) => publicRoute.href === router.pathname,
      );

      if (isLoggedIn) {
        try {
          const rawData = await USER.getOne(snapshot.uid);
          const data = normalizeData(rawData);
          const { providerId } = snapshot.providerData[0];

          setUser((prevUser) => ({
            ...prevUser,
            ...data,
            providerId,
          }));
          setIsVerified(true);
        } catch (err) {
          console.error(err);
        }
      } else {
        setUser(USER.defaultUser);
        setIsVerified(false);

        if (!isUserInAllowedPages) {
          gotoHome();
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
    <AuthContext.Provider value={{
      isVerifyingUser,
      isVerified,
      user,
      updateUser: setUser,
    }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
