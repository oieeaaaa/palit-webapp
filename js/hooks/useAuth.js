import { useRouter } from 'next/router';
import firebaseApp from 'firebase/app';

const useAuth = () => {
  const router = useRouter();

  /**
   * verifyUser
   */
  const verifyUser = () => {
    const unsubscribe = firebaseApp.auth().onAuthStateChanged((snapshot) => {
      const isLoggedIn = !!snapshot;

      if (!isLoggedIn) {
        router.push('/', '/');
      }
    });

    return unsubscribe;
  };

  /**
   * signUpWithEmailAndPassword.
   *
   * @param {string} email
   * @param {string} password
   */
  const signUpWithEmailAndPassword = (email, password) => (
    firebaseApp.auth().createUserWithEmailAndPassword(email, password)
  );

  /**
   * signInWithEmailAndPassword.
   *
   * @param {object} user
     * @param {string} email
     * @param {string} password
   */
  const signInWithEmailAndPassword = (email, password) => (
    firebaseApp.auth().signInWithEmailAndPassword(email, password)
  );

  /**
   * signInWithGoogle.
   */
  const signInWithGoogle = () => {
    const googleAuthProvider = new firebaseApp.auth.GoogleAuthProvider();

    return firebaseApp.auth().signInWithPopup(googleAuthProvider);
  };

  /**
   * signout.
   */
  const signout = () => firebaseApp.auth().signOut();

  return {
    verifyUser,
    signUpWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithGoogle,
    signout,
  };
};

export default useAuth;
