/*
***************************************
Component: AuthForm
Author: Joimee
Description:
***************************************
*/
import Link from 'next/link';

/**
 * AuthForm.
 *
 * @param {object} props
   * @param {object} fieldKeys
   * @param {function} onSubmit
   * @param {string} onSubmitText
 *
 */
const AuthForm = ({ fieldKeys, onSubmit, onSubmitText = 'Submit' }) => (
  <form className="authForm-form grid" onSubmit={onSubmit}>
    <label className="form-group" htmlFor={fieldKeys.email}>
      <span className="form-group__label">Email</span>
      <input
        id={fieldKeys.email}
        className="form__input"
        name={fieldKeys.email}
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
        type="password"
        required
      />
    </label>
    <div className="authForm-buttons">
      <Link href="/auth">
        <a className="button --default authForm__cancel">
          Cancel
        </a>
      </Link>
      <button className="button --primary authForm__submit" type="submit">
        {onSubmitText}
      </button>
    </div>
  </form>
);

export default AuthForm;
