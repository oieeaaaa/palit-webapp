import { useState } from 'react';
import Head from 'next/head';
import Header from 'components/header/header';
import ItemCard from 'components/itemCard/itemCard';
import { data as cardsData } from 'components/itemCard/itemCard.styleguide';
import Footer from 'components/footer/footer';
import GridGuides from 'styleguide/grid-guide';

const Home = () => {
  const [data, setData] = useState(cardsData);

  /**
   * It toggles ❤️
   * @param {number} id
   */
  const onLike = (id) => {
    setData((prevData) => prevData.map((item) => {
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

  return (
    <div className="home">
      <Head>
        <title>Palit</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <div className="grid home__list">
        {data.map((item) => (
          <ItemCard
            key={item.id}
            item={item}
            onLike={onLike}
            onTrade={onTrade}
          />
        ))}
      </div>
      <Footer />
      <GridGuides />
    </div>
  );
};

export default Home;
