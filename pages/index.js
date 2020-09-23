import { useState, useEffect, useContext } from 'react';
import UserContext from 'js/contexts/user';
import ITEM from 'js/models/item';
import useError from 'js/hooks/useError';
import useLikes from 'js/hooks/useLikes';

import Layout from 'components/layout/layout';
import ItemCard, { ItemCardSkeleton } from 'components/itemCard/itemCard';

const Home = () => {
  const user = useContext(UserContext);
  const [items, setItems] = useState(null);
  const [displayError] = useError();
  const { setLike, setUnlike } = useLikes();

  /**
   * getItems.
   *
   */
  const getItems = async () => {
    try {
      const data = await ITEM.getWithLikes(user.id);

      setItems(data);
    } catch (err) {
      displayError(err);
    }
  };

  /**
   * onLike.
   *
   * @param {object} payload
   */
  const onLike = async (payload) => {
    // TODO: This doesn't look right 👀
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
    getItems();
  }, []);

  return (
    <Layout title="Palit">
      <div className="home">
        <div className="grid home__list">
          {items ? items.map((item) => (
            <ItemCard
              key={item.key}
              item={item}
              onLike={onLike}
              linkOptions={{
                href: '/items/[itemID]',
                as: `/items/${item.key}`,
              }}
            />
          )) : (
            Array.from({ length: 10 }).map((_, index) => <ItemCardSkeleton key={index} />)
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Home;
