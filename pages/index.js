import { useState, useEffect, useContext } from 'react';
import Head from 'next/head';
import firebase from 'palit-firebase';
import UserContext from 'js/contexts/user';
import ITEM from 'js/models/item';
import { normalizeData } from 'js/utils';

import Header from 'components/header/header';
import ItemCard from 'components/itemCard/itemCard';
import Footer from 'components/footer/footer';

const Home = () => {
  const user = useContext(UserContext);
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);

  const getLikesAtItems = async () => {
    const db = firebase.database();
    const likesRef = db.ref('likes');

    try {
      likesRef.on('child_added', (snap) => {
        const itemRef = db.ref(`items/${snap.key}`);

        itemRef.once('value', (item) => {
          console.log({
            item: item.val(),
            likes: snap.val(),
          });
        });
      });
    } catch (err) {
      console.error(err);
      setError(err);
    }
  };

  const getItems = async () => {
    try {
      const rawData = await ITEM.get(user.id);

      setItems(normalizeData(rawData));
    } catch (err) {
      // 🚨
      console.error(err);
      setError(err);
    }
  };

  useEffect(() => {
    getItems();
    getLikesAtItems();
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
          />
        ))}
      </div>
      <Footer />
    </div>
  );
};

export default Home;
