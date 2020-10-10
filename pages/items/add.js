import { useContext, useState } from 'react';
import storage from 'js/storage';
import AuthContext from 'js/contexts/auth';
import LayoutContext from 'js/contexts/layout';
import useError from 'js/hooks/useError';
import ITEM from 'js/models/item';
import ItemForm from 'components/itemForm/itemForm';
import Layout from 'components/layout/layout';

const Add = () => {
  const [displayError] = useError();
  const { user } = useContext(AuthContext);
  const { handlers } = useContext(LayoutContext);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * handleSubmit.
   *
   * It should store the image to the firebase storage
   * It should save the form state to the realtime db in firebase
   * It should update the error state if something goes wrong
   * @param {object} e
   */
  const handleSubmit = async ({ imageFile, ...form }, clearForm) => {
    // Disable button while waiting for the requests below
    setIsLoading(true);

    // Problem: Firebase overrides the previous image if the filename already exists
    try {
      let cover = form.image;

      // fetch the public file URL then store it in the database
      if (imageFile) {
        const fileName = `${user.key}-${imageFile.name}`;
        cover = await storage.saveImage(imageFile, fileName);
      }

      // add new data in the database
      await ITEM.add(user.key, {
        ...form,
        cover,
      });

      handlers.showBanner({
        variant: 'success',
        text: `Added ${form.name} 🎉`,
      });

      clearForm();
    } catch (err) {
      displayError(err);
    } finally {
      // Enable submit button
      setIsLoading(false);
    }
  };

  return (
    <Layout title="Add new item">
      <ItemForm onSubmit={handleSubmit} isLoading={isLoading} />
    </Layout>
  );
};

export default Add;
