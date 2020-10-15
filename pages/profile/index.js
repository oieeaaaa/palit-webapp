import { useState, useContext } from 'react';
import LayoutContext from 'js/contexts/layout';
import AuthContext from 'js/contexts/auth';
import useError from 'js/hooks/useError';
import USER from 'js/models/user';
import storage from 'js/storage';
import Layout from 'components/layout/layout';
import ProfileForm from 'components/profileForm/profileForm';

const Profile = () => {
  // contexts
  const { handlers } = useContext(LayoutContext);
  const { updateUser } = useContext(AuthContext);

  // states
  const [isLoading, setIsLoading] = useState(false);

  // custom hooks
  const [displayError] = useError();

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
      displayError(err.message);
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
