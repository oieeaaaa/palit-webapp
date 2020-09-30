import { useContext } from 'react';
import Router from 'next/router';
import UserContext from 'js/contexts/user';
import useAuth from 'js/hooks/useAuth';
import useError from 'js/hooks/useError';
import Header from 'components/header/header';
import Banner from 'components/banner/banner';
import AuthForm from 'components/authForm/authForm';

/**
 * Login.
 */
const Login = () => {
  const user = useContext(UserContext);
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
  const handleSubmit = async (form) => {
    form.preventDefault();
    const { target: formEl } = form;

    try {
      await auth.signInWithEmailAndPassword(
        formEl[fieldKeys.email].value,
        formEl[fieldKeys.password].value,
      );

      Router.push('/', '/');
    } catch (err) {
      displayError(err);
    }
  };

  return (
    <div className="login">
      <Header user={user} />
      <Banner />
      <AuthForm
        fieldKeys={fieldKeys}
        onSubmit={handleSubmit}
        onSubmitText="Login"
      />
    </div>
  );
};

export default Login;
