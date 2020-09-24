import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { ReactSVG } from 'react-svg';
import useLikes from 'js/hooks/useLikes';
import ITEM from 'js/models/item';
import LayoutContext from 'js/contexts/layout';
import UserContext from 'js/contexts/user';
import Layout from 'components/layout/layout';

export default () => {
  const { handlers } = useContext(LayoutContext);
  const user = useContext(UserContext);
  const router = useRouter();
  const [item, setItem] = useState({});
  const { setLike, setUnlike } = useLikes();

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
      const data = await ITEM.getOneWithLikes(key);

      setItem(data);
    } catch (err) {
      handlers.showBanner({
        variant: 'error',
        text: err.message,
      });
    }
  };

  /**
   * onLike.
   */
  const onLike = () => {
    if (item.isLiked) {
      setLike(item, () => {
        setItem((prevItem) => ({
          ...prevItem,
          likes: prevItem.likes - 1,
          isLiked: false,
        }));
      });
    } else {
      setUnlike(item.key, () => {
        setItem((prevItem) => ({
          ...prevItem,
          likes: prevItem.likes + 1,
          isLiked: true,
        }));
      });
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
          <figure className="item__image">
            <img src={item.cover} alt={item.name} />
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
                Name:
                {' '}
                <strong>{user.firstName}</strong>
                {' '}
                <strong>{user.lastName}</strong>
              </li>
              <li className="item-card__item">
                Address:
                {' '}
                <strong>{user.address}</strong>
              </li>
              <li className="item-card__item">
                Email:
                {' '}
                <strong>
                  <a
                    href={`mailto:${user.email}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {user.email}
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
