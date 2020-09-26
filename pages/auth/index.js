import { ReactSVG } from 'react-svg';
import Link from 'next/link';
import Router from 'next/router';
import useAuth from 'js/hooks/useAuth';
import useError from 'js/hooks/useError';

const Auth = () => {
  const auth = useAuth();
  const [displayError] = useError();

  /**
   * login.
   */
  const login = async () => {
    try {
      await auth.signInWithGoogle();

      Router.push('/', '/', { shallow: true });
    } catch (err) {
      displayError(err);
    }
  };

  return (
    <div className="auth">
      <div className="grid">
        <h1 className="auth__title">
          Palit
        </h1>
        <div className="auth-buttons">
          <Link href="/auth/signup">
            <a
              className="button --primary --with-icon auth__signup"
            >
              Create an account
            </a>
          </Link>
          <span className="auth__text">
            or
          </span>
          <button
            className="button --primary-dark --with-icon auth__login-with-google"
            type="button"
            onClick={login}
          >
            <ReactSVG
              className="button-icon"
              src="/icons/google-social.svg"
            />
            <span>
              Login with google
            </span>
          </button>
          <Link href="/auth/login">
            <a
              className="button --primary-link --with-icon auth__login"
            >
              I already have an account
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Auth;
