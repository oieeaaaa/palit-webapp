/*
***************************************
Component: Item Card
Author: Joimee
Description:
***************************************
*/
import Link from 'next/link';
import { ReactSVG } from 'react-svg';

export default ({ item, onLike, onTrade }) => (
  <Link href="/items/[itemID]" as={`/items/${item.key}`}>
    <a className="itemCard">

      {/* TITLE */}
      <h2 className="itemCard__title" title={item.name}>{item.name}</h2>

      {/* BODY */}
      <div className="itemCard__body">

        {/* IMAGE */}
        <figure className="itemCard__image">
          <img src={item.cover} alt="Union Patente" />
        </figure>

        {/* META */}
        <div className="itemCard__meta">

          {/* META HEAD */}
          <div className="itemCard__meta-head">

            {/* META TEXT */}
            <p className="itemCard__meta-text">
              Likes
            </p>

            {/* LIKE BUTTON */}
            <button
              className="itemCard__button"
              type="button"
              onClick={() => onLike(item.key, item.likes)}
            >
              <ReactSVG
                className="itemCard__meta-icon"
                src={`/icons/heart-${item.is_liked ? 'filled' : 'outline'}.svg`}
              />
            </button>
          </div>

          {/* LIKES */}
          <p className="itemCard__meta-subtext">
            {item.likes}
          </p>
        </div>

        {/* META */}
        <div className="itemCard__meta">

          {/* HEAD */}
          <div className="itemCard__meta-head">

            {/* TEXT */}
            <p className="itemCard__meta-text">
              Trade Request
            </p>

            {/* TRADE BUTTOn */}
            <button
              className="itemCard__button"
              type="button"
              onClick={() => onTrade(item.key)}
            >
              <ReactSVG
                className="itemCard__meta-icon"
                src={`/icons/cart-${item.isTraded ? 'filled' : 'outline'}.svg`}
              />
            </button>
          </div>

          {/* TRADE REQUESTS */}
          <p className="itemCard__meta-subtext">
            {item.tradeRequests}
          </p>
        </div>
      </div>
    </a>
  </Link>
);
