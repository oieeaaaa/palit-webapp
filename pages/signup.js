import { useState, useContext } from 'react';
import { ReactSVG } from 'react-svg';
import Router from 'next/router';
import Link from 'next/link';
import LayoutContext from 'js/contexts/layout';
import useError from 'js/hooks/useError';
import useAuth from 'js/hooks/useAuth';
import USER from 'js/models/user';
import Banner from 'components/banner/banner';
import { LandingFooter } from 'components/landing/landing';

/**
 * Signup.
 */
const Signup = () => {
  // contexts
  const { handlers } = useContext(LayoutContext);

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
  const handleSubmit = async () => {
    form.preventDefault();

    try {
      setIsLoading(true);

      const result = await auth.signUpWithEmailAndPassword(
        form[fieldKeys.email],
        form[fieldKeys.password],
      );

      await USER.add(result.user.uid, { email: result.user.email });

      // redirect to homepage
      Router.push('/', '/', { shallow: true });
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

  const handleGoogleSignup = async () => {
    try {
      const result = await auth.signInWithGoogle();

      if (result.additionalUserInfo.isNewUser) {
        await USER.add(result.user.uid, {
          email: result.user.email,
          avatar: result.user.photoURL,
        });
      } else {
        handlers.showBanner({
          text: "You're already signed in",
          variant: 'success',
        });
      }

      Router.push('/', '/', { shallow: true });
    } catch (err) {
      displayError(err);
    }
  };

  return (
    <div className="signup">
      <Banner />
      <div className="grid">
        <h1 className="signup__heading --brand">Palit</h1>
        <form className="signup-form" onSubmit={handleSubmit}>
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
          <div className="signup-buttons">
            <Link href="/">
              <a className="button --default signup__cancel">
                Cancel
              </a>
            </Link>
            <button
              className={`button --primary signup__submit ${isLoading ? '--disabled' : ''}`}
              type="submit"
              disabled={isLoading}
            >
              Signup
            </button>
            <p className="signup__text signup__divider">or</p>
            <button
              className="button --primary-dark signup__submit-with-google"
              type="button"
              onClick={handleGoogleSignup}
            >
              <ReactSVG
                className="button-icon"
                src="/icons/google-social.svg"
              />
              Signup with google
            </button>
          </div>
        </form>
      </div>
      <LandingFooter />
    </div>
  );
};

export default Signup;
