import { useState, useEffect } from 'react';
import Head from 'next/head';
import firebase from 'palit-firebase';

import Header from 'components/header/header';
import ItemCard from 'components/itemCard/itemCard';
import Footer from 'components/footer/footer';

import { objectToArray } from 'js/utils';

const Home = () => {
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);

  const getItems = async () => {
    const itemsRef = firebase.database().ref('items');

    try {
      const data = await itemsRef.once('value');

      // 🎉
      setItems(objectToArray(data.val()));
    } catch (err) {
      // 🚨
      console.error(err);
      setError(err);
    }
  };

  /**
   * It toggles ❤️
   * @param {number} id
   */
  const onLike = (id) => {
    setItems((prevData) => prevData.map((item) => {
      if (item.id === id) {
        item.is_liked = !item.is_liked;
      }

      return item;
    }));
  };

  /**
   * It redirects the user to the item page
   * @param {number} id
   */
  const onTrade = () => {
    // trade logic here...
    console.log('%c Wanna trade?', 'font-size: 24px; font-family: "Avenir"'); // eslint-disable-line
  };

  useEffect(() => {
    getItems();
  }, []);

  return (
    <div className="home">
      <Head>
        <title>Palit</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <div className="grid home__list">
        {items.map((item) => (
          <ItemCard
            key={item.key}
            item={item}
            onLike={onLike}
            onTrade={onTrade}
          />
        ))}
      </div>
      <Footer />
    </div>
  );
};

export default Home;
