import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { ReactSVG } from 'react-svg';
import useError from 'js/hooks/useError';
import useLikes from 'js/hooks/useLikes';
import useProtection from 'js/hooks/useProtection';
import ITEM from 'js/models/item';
import LayoutContext from 'js/contexts/layout';
import UserContext from 'js/contexts/user';
import Layout from 'components/layout/layout';

const ItemDetails = () => {
  const { handlers } = useContext(LayoutContext);
  const user = useContext(UserContext);
  const [displayError] = useError();
  const router = useRouter();
  const [item, setItem] = useState({});
  const [isOwned, setIsOwned] = useState(false);
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

      if (data.owner === user.key) {
        setIsOwned(true);
      }
    } catch (err) {
      displayError(err);
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
          <figure className="item__image">
            <img src={item.cover} alt={item.name} />
          </figure>
          <h1 className="item__title">
            {item.name}
          </h1>
          <div className="item-card --info">
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
          <div className="item-card --remarks">
            <h2 className="item-card__title">
              Remarks
            </h2>
            <div className="item-card__details">
              <p className="item-card__text">
                {item.remarks}
              </p>
            </div>
          </div>
          {isOwned ? (
            <Link href="/items/edit/[editItemID]" as={`/items/edit/${item.key}`}>
              <a className="button --primary item__edit">
                <span>Edit</span>
              </a>
            </Link>
          ) : (
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
          )}
          {isOwned ? (
            <button
              className="button --dark --red-outline item__delete"
              type="button"
              onClick={removeItem}
            >
              <span>Delete</span>
            </button>
          ) : (
            <Link href="/trades/request/[itemID]" as={`/trades/request/${item.key}`}>
              <a className="button --primary-dark item__trade">
                <ReactSVG className="button-icon" src="/icons/cart-filled.svg" />
                <span>Trade Requests</span>
              </a>
            </Link>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default useProtection(ItemDetails);
