import Router from 'next/router';
import useError from 'js/hooks/useError';
import useAuth from 'js/hooks/useAuth';
import USER from 'js/models/user';
import Header from 'components/header/header';
import Banner from 'components/banner/banner';
import AuthForm from 'components/authForm/authForm';

// TODO: This and auth/login can be merged into a single page using query or pathnames

/**
 * Signup.
 */
const Signup = () => {
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
      const result = await auth.signUpWithEmailAndPassword(
        formEl[fieldKeys.email].value,
        formEl[fieldKeys.password].value,
      );

      await USER.add(result.user.uid, result.user.email);

      // redirect to homepage
      Router.push('/', '/', { shallow: true });
    } catch (err) {
      displayError(err);
    }
  };

  return (
    <div className="signup">
      <Header />
      <Banner />
      <AuthForm
        fieldKeys={fieldKeys}
        onSubmit={handleSubmit}
        onSubmitText="Create account"
      />
    </div>
  );
};

export default Signup;