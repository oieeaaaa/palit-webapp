import { useState, useEffect, useContext } from 'react';
import UserContext from 'js/contexts/user';
import ITEM from 'js/models/item';
import LIKES from 'js/models/likes';
import { normalizeData } from 'js/utils';

import Layout from 'components/layout/layout';
import ItemCard from 'components/itemCard/itemCard';

const Home = () => {
  const user = useContext(UserContext);
  const [items, setItems] = useState([]);

  /**
   * getItems.
   *
   */
  const getItems = async () => {
    try {
      const rawData = await ITEM.get(user.id);
      const data = normalizeData(rawData);

      setItems(data);
    } catch (err) {
      // 🚨
      console.error(err);
    }
  };

  /**
   * onLike.
   *
   * @param {object} payload
   */
  const onLike = async (payload) => {
    try {
      let isLiked = false;

      if (payload.isLiked) {
        await LIKES.remove(user.id, payload.key);
        isLiked = false;
      } else {
        await LIKES.add(user.id, payload.key);
        isLiked = true;
      }

      setItems((prevItems) => prevItems.map((item) => {
        if (item.key === payload.key) {
          item = {
            ...item,
            likes: isLiked ? (item.likes + 1) : (item.likes - 1),
            isLiked,
          };
        }

        return item;
      }));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getItems();
  }, []);

  return (
    <Layout title="Palit">
      <div className="home">
        <div className="grid home__list">
          {items.map((item) => (
            <ItemCard
              key={item.key}
              item={item}
              onLike={onLike}
              linkOptions={{
                href: '/items/[itemID]',
                as: `/items/${item.key}`,
              }}
            />
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Home;
