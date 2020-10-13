import { useState, useContext } from 'react';
import { ReactSVG } from 'react-svg';
import Link from 'next/link';
import AuthContext from 'js/contexts/auth';
import useAuth from 'js/hooks/useAuth';
import useError from 'js/hooks/useError';
import { gotoHome } from 'js/helpers/router';

import { LandingFooter } from 'components/landing/landing';
import Banner from 'components/banner/banner';
import LoadingScreen from 'components/loadingScreen/loadingScreen';

/**
 * Login.
 */
const Login = () => {
  // contexts
  const { isVerified, isVerifyingUser } = useContext(AuthContext);

  // states
  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const [isLoading, setIsLoading] = useState(false);

  // custom hooks
  const auth = useAuth();
  const [displayError] = useError();

  // Field keys
  const fieldKeys = {
    email: 'email',
    password: 'password',
  };

  /**
   * handleSubmit.
   *
   * @param {object} form
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsLoading(true);

      await auth.signInWithEmailAndPassword(
        form[fieldKeys.email],
        form[fieldKeys.password],
      );

      gotoHome();
    } catch (err) {
      displayError(err);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * handleChange.
   *
   * @param {object} e
   */
  const handleChange = (e) => {
    e.persist();

    setForm((prevForm) => ({
      ...prevForm,
      [e.target.name]: e.target.value,
    }));
  };

  /**
   * handleGoogleSignIn
   */
  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);

      await auth.signInWithGoogle();

      gotoHome();
    } catch (err) {
      displayError(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isVerifyingUser) return <LoadingScreen />;
  if (isVerified) {
    gotoHome();

    return <p>Redirecting...</p>;
  }

  return (
    <div className="login">
      <Banner />
      <div className="grid">
        <h1 className="login__heading --brand">Palit</h1>
        <form className="login-form" onSubmit={handleSubmit}>
          <label className="form-group" htmlFor={fieldKeys.email}>
            <span className="form-group__label">Email</span>
            <input
              id={fieldKeys.email}
              className="form__input"
              name={fieldKeys.email}
              value={form[fieldKeys.email]}
              onChange={handleChange}
              type="email"
              required
            />
          </label>
          <label className="form-group" htmlFor={fieldKeys.password}>
            <span className="form-group__label">Password</span>
            <input
              id={fieldKeys.password}
              className="form__input"
              name={fieldKeys.password}
              value={form[fieldKeys.password]}
              onChange={handleChange}
              type="password"
              required
            />
          </label>
          <div className="login-buttons">
            <Link href="/">
              <a className="button --default login__back" type="button">
                Back
              </a>
            </Link>
            <button
              className={`button --primary login__submit ${isLoading ? '--disabled' : ''}`}
              type="submit"
              disabled={isLoading}
            >
              Login
            </button>
            <p className="login__text login__divider">or</p>
            <button
              className="button --primary-dark login__submit-with-google"
              type="button"
              onClick={handleGoogleSignIn}
            >
              <ReactSVG
                className="button-icon"
                src="/icons/google-social.svg"
              />
              Login with google
            </button>
          </div>
        </form>
      </div>
      <LandingFooter />
    </div>
  );
};

export default Login;
