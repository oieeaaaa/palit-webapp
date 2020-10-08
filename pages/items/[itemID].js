import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import useError from 'js/hooks/useError';
import useProtection from 'js/hooks/useProtection';
import ITEM from 'js/models/item';
import LIKES from 'js/models/likes';
import LayoutContext from 'js/contexts/layout';
import AuthContext from 'js/contexts/auth';
import Layout from 'components/layout/layout';
import {
  ItemDetailsImage,
  ItemDetailsTitle,
  ItemDetailsCard,
  ItemDetailsCardTitle,
  ItemDetailsCardDetails,
  ItemDetailsCardRemarks,
  ItemDetailsOwnedActions,
  ItemDetailsUnownedActions,
} from 'components/itemDetails/itemDetails';

const ItemDetails = () => {
  // contexts
  const { handlers } = useContext(LayoutContext);
  const { user } = useContext(AuthContext);

  // states
  const [item, setItem] = useState({});
  const [isOwned, setIsOwned] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

  // custom hooks
  const [displayError] = useError();
  const router = useRouter();
  /**
   * getItem
   *
   * It should fetch the item
   * It should display an error or success message
   *
   * @type {string} key
   */
  const getItem = async (key) => {
    try {
      const data = await ITEM.getOneWithLikes(user.key, key);

      setItem(data);

      if (data.owner === user.key) {
        setIsOwned(true);
      }
    } catch (err) {
      displayError(err);
    }
  };

  const onLike = async () => {
    setIsLiking(true);

    try {
      const isToLiked = !item.isLiked;

      if (isToLiked) {
        await LIKES.add(user.key, item.key);
      } else {
        await LIKES.remove(user.key, item.key);
      }

      setItem((prevItem) => ({
        ...prevItem,
        likes: isToLiked ? prevItem.likes + 1 : prevItem.likes - 1,
        isLiked: !!isToLiked,
      }));
    } catch (err) {
      console.log(err);
    } finally {
      setIsLiking(false);
    }
  };

  /**
   * removeItem
   */
  const removeItem = async () => {
    try {
      await ITEM.remove(item.key);

      // redirect to inventory after delete
      router.push('/inventory', '/inventory');

      handlers.showBanner({
        text: `Deleted ${item.name} 🔥`,
        variant: 'info',
      });
    } catch (err) {
      displayError(err);
    }
  };

  /**
   * useEffect.
   */
  useEffect(() => {
    const { itemID } = router.query;

    if (!itemID) return;

    getItem(itemID);
  }, [router]);

  return (
    <Layout title={item.name}>
      <div className="item">
        <div className="grid">
          <ItemDetailsImage cover={item.cover} name={item.name} />
          <ItemDetailsTitle name={item.name} />
          <ItemDetailsCard>
            <ItemDetailsCardTitle text="Product Info" />
            <ItemDetailsCardDetails
              tradeRequests={item.tradeRequests}
              likes={item.likes}
            />
          </ItemDetailsCard>
          <ItemDetailsCard variant="--remarks">
            <ItemDetailsCardTitle text="Remarks" />
            <ItemDetailsCardRemarks remarks={item.remarks} />
          </ItemDetailsCard>
          {isOwned ? (
            <ItemDetailsOwnedActions
              itemKey={item.key}
              removeItem={removeItem}
            />
          ) : (
            <ItemDetailsUnownedActions
              itemKey={item.key}
              onLike={onLike}
              isLiked={item.isLiked}
              isLiking={isLiking}
              isTraded={item.isTraded}
            />
          )}
        </div>
      </div>
    </Layout>
  );
};

export default useProtection(ItemDetails);
