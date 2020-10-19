import { useState, useContext } from 'react';
import LayoutContext from 'js/contexts/layout';
import AuthContext from 'js/contexts/auth';
import useError from 'js/hooks/useError';
import useAuth from 'js/hooks/useAuth';
import USER from 'js/models/user';
import storage from 'js/storage';
import Layout from 'components/layout/layout';
import ProfileForm from 'components/profileForm/profileForm';

const Profile = () => {
  // contexts
  const { handlers } = useContext(LayoutContext);
  const { user, updateUser } = useContext(AuthContext);

  // states
  const [isLoading, setIsLoading] = useState(false);

  // custom hooks
  const [displayError] = useError();
  const { updateEmail } = useAuth();

  /**
   * handleSubmit
   *
   * @param {string} userID
   * @param {object} form
   */
  const handleSubmit = async (userID, form) => {
    setIsLoading(true);

    try {
      let { avatar } = form;

      if (typeof avatar !== 'string') {
        const fileName = `${userID}-${avatar.name}`;
        avatar = await storage.saveImage(avatar, fileName);
      }

      // update email in auth
      if (user.email !== form.email) {
        await updateEmail(form.email);
      }

      const userPayload = {
        ...form,
        avatar,
      };

      await USER.update(userID, userPayload);

      updateUser((prevUser) => ({
        ...prevUser,
        ...userPayload,
      }));

      handlers.showBanner({
        text: 'Updated Profile ✨',
        variant: 'success',
      });
    } catch (err) {
      displayError(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout title="Profile">
      <div className="profile">
        <ProfileForm onSubmit={handleSubmit} isLoading={isLoading} />
      </div>
    </Layout>
  );
};

export default Profile;
