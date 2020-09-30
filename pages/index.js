import {
  useState,
  useEffect,
  useContext,
  useCallback,
} from 'react';
import UserContext from 'js/contexts/user';
import ITEM from 'js/models/item';
import useError from 'js/hooks/useError';
import useLikes from 'js/hooks/useLikes';
import useProtection from 'js/hooks/useProtection';
import useLimitChangeOnScroll from 'js/hooks/useLimitChangeOnScroll';

import Layout from 'components/layout/layout';
import ItemCard, { ItemCardSkeleton } from 'components/itemCard/itemCard';

const Home = () => {
  const user = useContext(UserContext);
  const [items, setItems] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const isItemsEmpty = useCallback(() => !!(items && !items.length), [items]);
  const [displayError] = useError();
  const { setLike, setUnlike } = useLikes();
  const limit = useLimitChangeOnScroll(10);

  /**
   * getItems.
   */
  const getItems = async () => {
    const userKey = user.key;

    // prevent simultaneous re-fetch
    if (isLoading) return;

    try {
      setIsLoading(true);

      const data = await ITEM.getWithIsLiked(userKey, limit);
      const otherUsersItems = data.filter((item) => item.owner !== userKey);

      setItems(otherUsersItems);
    } catch (err) {
      displayError(err);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * onLike.
   *
   * @param {object} payload
   */
  const onLike = async (payload) => {
    if (!payload.isLiked) {
      setLike(payload, (data) => {
        setItems((prevItems) => prevItems.map((prevItem) => {
          if (prevItem.key === data.key) {
            prevItem.likes += 1;
            prevItem.isLiked = true;
          }

          return prevItem;
        }));
      });
    } else {
      setUnlike(payload.key, (removedItemID) => {
        setItems((prevItems) => prevItems.map((prevItem) => {
          if (prevItem.key === removedItemID) {
            prevItem.likes -= 1;
            prevItem.isLiked = false;
          }

          return prevItem;
        }));
      });
    }
  };

  /**
   * useEffect.
   */
  useEffect(() => {
    getItems(user.key);
  }, [limit]);

  /**
   * renderItems.
   */
  const renderItems = () => {
    const isItemsExists = !!items;

    if (isLoading || !isItemsExists) {
      return Array.from({ length: limit }).map((_, index) => <ItemCardSkeleton key={index} />);
    }

    return items.map((item) => (
      <ItemCard
        key={item.key}
        item={item}
        onLike={onLike}
        linkOptions={{
          href: '/items/[itemID]',
          as: `/items/${item.key}`,
        }}
      />
    ));
  };

  /**
   * renderEmptyState
   */
  const renderEmptyState = () => isItemsEmpty() && (
    <div className="tip">
      <h1 className="tip-heading">
        Wow!
      </h1>
      <p className="tip-text">
        It&apos;s empty.
      </p>
    </div>
  );

  return (
    <Layout title="Palit">
      <div className="home">
        <div className="grid home__list">
          {renderItems()}
          {renderEmptyState()}
        </div>
      </div>
    </Layout>
  );
};

export default useProtection(Home);
