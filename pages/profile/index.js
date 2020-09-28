import { useState, useContext } from 'react';
import LayoutContext from 'js/contexts/layout';
import useError from 'js/hooks/useError';
import USER from 'js/models/user';
import storage from 'js/storage';
import Layout from 'components/layout/layout';
import ProfileForm from 'components/profileForm/profileForm';

const Profile = () => {
  const { handlers } = useContext(LayoutContext);
  const [displayError] = useError();
  const [isLoading, setIsLoading] = useState(false);

  /**
   * handleSubmit
   *
   * @param {string} userID
   * @param {object} form
   */
  const handleSubmit = async (userID, { avatarFile, avatar, ...form }) => {
    setIsLoading(true);

    try {
      if (avatarFile) {
        avatar = await storage.saveImage(avatarFile);
      }

      await USER.update(userID, {
        ...form,
        avatar,
      });

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
