import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { ReactSVG } from 'react-svg';
import ITEM from 'js/models/item';
import LIKES from 'js/models/likes';
import LayoutContext from 'js/contexts/layout';
import UserContext from 'js/contexts/user';

import Layout from 'components/layout/layout';

export default () => {
  const { handlers } = useContext(LayoutContext);
  const user = useContext(UserContext);
  const router = useRouter();
  const [item, setItem] = useState({});

  /**
   * checkIfLiked.
   *
   * @type {string} itemID
   * @type {string} userID
   */
  const checkIfLiked = async (itemID, userID) => {
    let isLiked = false;

    try {
      const res = await LIKES.getOne(itemID);
      const data = res.data();

      if (data[userID]) {
        isLiked = true;
      }
    } catch (err) {
      handlers.showBanner({
        variant: 'error',
        text: err.message,
      });
    }

    return isLiked;
  };

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
      const res = await ITEM.getOne(key);
      const isLiked = await checkIfLiked(key, user.id);
      const data = res.data();

      setItem({
        ...data,
        key: res.id,
        isLiked,
      });

      handlers.showBanner({
        variant: 'success',
        text: `Successfully retrieved ${data.name} 🎉`,
      });
    } catch (err) {
      handlers.showBanner({
        variant: 'error',
        text: err.message,
      });
    }
  };

  /**
   * It toggles ❤️
   */
  const onLike = async () => {
    try {
      let isLiked = false;

      if (item.isLiked) {
        await LIKES.remove(user.id, item.key);

        isLiked = false;
      } else {
        await LIKES.add(user.id, item.key);

        isLiked = true;
      }

      setItem((prevItem) => ({
        ...prevItem,
        isLiked,
      }));
    } catch (err) {
      console.log(err);
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

  // TODO: display basic loading skeleton
  if (!item) return null;

  return (
    <Layout title={item.title}>
      <div className="item">
        <div className="grid">
          <figure className="item__image">
            <img src={item.cover} alt={item.title} />
          </figure>
          <h1 className="item__title">
            {item.title}
          </h1>
          <div className="item-card">
            <h2 className="item-card__title">
              Product Info
            </h2>
            <ul className="item-card__details">
              <li className="item-card__item">
                Trade Requests:
                {' '}
                <strong>{item.tradeRequests}</strong>
              </li>
              <li className="item-card__item">
                Likes:
                {' '}
                <strong>{item.likes}</strong>
              </li>
            </ul>
          </div>
          <div className="item-card">
            <h2 className="item-card__title">
              Owner Info
            </h2>
            <ul className="item-card__details">
              <li className="item-card__item">
                First Name:
                {' '}
                <strong>John</strong>
              </li>
              <li className="item-card__item">
                Last Name:
                {' '}
                <strong>Doe</strong>
              </li>
              <li className="item-card__item">
                Address:
                {' '}
                <strong>Cauayan City, Isabela</strong>
              </li>
              <li className="item-card__item">
                Email:
                {' '}
                <strong>
                  <a
                    href="mailto:john.doe@gmail.com"
                    target="_blank"
                    rel="noreferrer"
                  >
                    john.doe@gmail.com
                  </a>
                </strong>
              </li>
            </ul>
          </div>
          <div className="item-card">
            <h2 className="item-card__title">
              Remarks
            </h2>
            <div className="item-card__details">
              <p className="item-card__text">
                {item.remarks}
              </p>
            </div>
          </div>
          <button
            className="button --default item__like"
            type="button"
            onClick={onLike}
          >
            <ReactSVG
              className="button-icon"
              src={`/icons/heart-${item.isLiked ? 'filled' : 'outline'}.svg`}
            />
            <span>Like</span>
          </button>
          <Link href="/trades/request/[itemID]" as={`/trades/request/${item.key}`}>
            <a className="button --primary-dark item__trade">
              <ReactSVG className="button-icon" src="/icons/cart-filled.svg" />
              <span>Trade Requests</span>
            </a>
          </Link>
        </div>
      </div>
    </Layout>
  );
};
