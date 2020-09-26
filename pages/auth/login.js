import Router from 'next/router';
import useAuth from 'js/hooks/useAuth';
import useError from 'js/hooks/useError';
import Header from 'components/header/header';
import Banner from 'components/banner/banner';
import AuthForm from 'components/authForm/authForm';

// TODO: This and auth/signup can be merged into a single page using query or pathnames

/**
 * Login.
 */
const Login = () => {
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

      Router.push('/', '/', { shallow: true });
    } catch (err) {
      displayError(err);
    }
  };

  return (
    <div className="login">
      <Header />
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
