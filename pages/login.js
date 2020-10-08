import { useState } from 'react';
import { ReactSVG } from 'react-svg';
import Router from 'next/router';
import Link from 'next/link';
import useAuth from 'js/hooks/useAuth';
import useError from 'js/hooks/useError';

import { LandingFooter } from 'components/landing/landing';

/**
 * Login.
 */
const Login = () => {
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

      Router.push('/', '/');
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

      Router.push('/', '/');
    } catch (err) {
      displayError(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login">
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
