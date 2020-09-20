import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import { ReactSVG } from 'react-svg';
import ITEM from 'js/models/item';
import { normalizeData } from 'js/utils';
import LayoutContext from 'js/contexts/layout';

import Layout from 'components/layout/layout';

const Item = () => {
  const { handlers } = useContext(LayoutContext);
  const router = useRouter();
  const [item, setItem] = useState({});

  const getItem = async (key) => {
    try {
      const res = await ITEM.getOne(key);
      const data = normalizeData(res);

      setItem(data);
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

  useEffect(() => {
    if (!router.query.itemID) return;

    getItem(router.query.itemID);
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
          <button className="item__button --default" type="button">
            <ReactSVG className="item__button-icon" src="/icons/heart-outline.svg" />
            <span>Like</span>
          </button>
          <button className="item__button --primary-dark" type="button">
            <ReactSVG className="item__button-icon" src="/icons/cart-filled.svg" />
            <span>Trade Requests</span>
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default Item;
