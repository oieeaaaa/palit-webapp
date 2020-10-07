import firebaseApp from 'firebase/app';

const useAuth = () => {
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
    signUpWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithGoogle,
    signout,
  };
};

export default useAuth;
