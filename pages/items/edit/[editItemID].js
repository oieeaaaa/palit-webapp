import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import LayoutContext from 'js/contexts/layout';
import AuthContext from 'js/contexts/auth';
import useError from 'js/hooks/useError';
import ITEM from 'js/models/item';
import { normalizeData } from 'js/utils';
import storage from 'js/storage';
import Layout from 'components/layout/layout';
import ItemForm, { initialFormValues } from 'components/itemForm/itemForm';

const ItemEdit = () => {
  // contexts
  const { user } = useContext(AuthContext);
  const { handlers } = useContext(LayoutContext);

  // states
  const [item, setItem] = useState(initialFormValues);
  const [isLoading, setIsLoading] = useState(false);

  // custom hooks
  const [displayError] = useError();
  const router = useRouter();

  /**
   * @param {string} itemID
   */
  const getItem = async (itemID) => {
    try {
      const rawItem = await ITEM.getOne(itemID);

      setItem(normalizeData(rawItem));
    } catch (err) {
      displayError(err);
    }
  };

  /**
   * handleSubmit
   */
  const handleSubmit = async ({ imageFile, ...form }) => {
    setIsLoading(true);

    try {
      let cover = form.image;

      if (imageFile) {
        const fileName = `${user.key}-${imageFile.name}`;
        cover = await storage.saveImage(imageFile, fileName);
      }

      await ITEM.update(item.key, {
        name: form.name,
        remarks: form.remarks,
        cover,
      });

      handlers.showBanner({
        text: 'Updated item 🎉',
        variant: 'success',
      });
    } catch (err) {
      displayError(err);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * useEffect.
   */
  useEffect(() => {
    if (!router.query.editItemID) return;
    const { editItemID } = router.query;

    getItem(editItemID);
  }, [router]);

  return (
    <Layout title="Edit Item">
      <ItemForm
        onSubmit={handleSubmit}
        isLoading={isLoading}
        data={item}
        variant="edit"
      />
    </Layout>
  );
};

export default ItemEdit;
