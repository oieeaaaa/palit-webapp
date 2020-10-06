import {
  useState,
  useEffect,
  useContext,
  useCallback,
} from 'react';
import UserContext from 'js/contexts/user';
import ITEM from 'js/models/item';
import LIKES from 'js/models/likes';
import useError from 'js/hooks/useError';
import useInfiniteScroll from 'js/hooks/useInfiniteScroll';

import Layout from 'components/layout/layout';
import Landing from 'components/landing/landing';
import { HomeItems, HomeItemsEmpty } from 'components/home/home';

const Home = () => {
  // contexts
  const user = useContext(UserContext);

  // states
  const [items, setItems] = useState(null);
  const [itemsStats, setItemsStats] = useState(null);
  const [isLiking, setIsLiking] = useState(false);

  // callbacks
  const isItemsEmpty = useCallback(() => !!(items && !items.length), [items]);

  // custom hooks
  const [displayError] = useError();
  const { isFetching } = useInfiniteScroll(getItems, itemsStats?.totalItems);

  /**
   * getItems.
   */
  async function getItems(limit) {
    const userKey = user.key;

    // prevent simultaneous re-fetch
    if (isFetching) return;

    try {
      const data = await ITEM.getWithIsLiked(userKey, limit);
      const otherUsersItems = data.filter((item) => item.owner !== userKey);

      setItems(otherUsersItems);
    } catch (err) {
      displayError(err);
    }
  }

  /**
   * getItemsStats
   */
  const getItemsStats = async () => {
    try {
      const rawItemsStats = await ITEM.getItemsStats();

      setItemsStats(rawItemsStats.data());
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
    setIsLiking(true);

    try {
      const isToLiked = !payload.isLiked;

      if (isToLiked) {
        await LIKES.add(user.key, payload.key);
      } else {
        await LIKES.remove(user.key, payload.key);
      }

      setItems((prevItems) => prevItems.map((prevItem) => {
        if (prevItem.key !== payload.key) return prevItem;

        if (isToLiked) {
          prevItem.likes += 1;
          prevItem.isLiked = true;
        } else {
          prevItem.likes -= 1;
          prevItem.isLiked = false;
        }

        return prevItem;
      }));
    } catch (err) {
      console.log(err);
    } finally {
      setIsLiking(false);
    }
  };

  /**
   * useEffect.
   */
  useEffect(() => {
    if (!user.key) return;

    const isNotInitalized = !itemsStats && !items;

    if (isNotInitalized) {
      getItemsStats();
      getItems();
    }
  }, []);

  if (!user.key) return <Landing />;

  return (
    <Layout title="Palit">
      <div className="home">
        <div className="grid home__list">
          <HomeItems items={items} onLike={onLike} isFetching={isFetching} isLiking={isLiking} />
          <HomeItemsEmpty isEmpty={isItemsEmpty()} />
        </div>
      </div>
    </Layout>
  );
};

export default Home;
