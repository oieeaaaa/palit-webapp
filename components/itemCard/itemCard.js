/*
***************************************
Component: Item Card
Author: Joimee
Description:
***************************************
*/
import Link from 'next/link';
import Icon from 'components/icon/icon';

export const ItemCardSkeleton = () => (
  <div className="itemCard-skeleton">
    <span className="itemCard-skeleton__title" />
    <div className="itemCard-skeleton__body">
      <div className="itemCard-skeleton__image" />
      <div className="itemCard-skeleton__meta">
        <span className="itemCard-skeleton__text" />
        <span className="itemCard-skeleton__subtext" />

        <span className="itemCard-skeleton__text --long" />
        <span className="itemCard-skeleton__subtext" />
      </div>
    </div>
  </div>
);

const ItemCard = ({
  item,
  onLike,
  enableTrade,
  isLiking,
  isIndicatorOn,
  linkOptions,
}) => (
  <div className="itemCard">
    {/* TITLE */}
    <h2 className="itemCard__title" title={item.name}>{item.name}</h2>

    {/* BODY */}
    <div className="itemCard__body">
      {/* INDICATOR */}
      {(item.isDirty && isIndicatorOn) && <span className="itemCard__indicator" />}

      <Link {...linkOptions}>
        <a className="itemCard__link">

          {/* IMAGE */}
          <figure className="itemCard__image">
            <img src={item.cover} alt={item.name} />
          </figure>
        </a>
      </Link>

      {/* META */}
      <div className="itemCard__meta">

        {/* META HEAD */}
        <div className="itemCard__meta-head">

          {/* META TEXT */}
          <p className="itemCard__meta-text">
            Likes
          </p>

          {/* LIKE BUTTON */}
          {onLike && (
          <button
            className="itemCard__button"
            type="button"
            onClick={() => onLike({ isLiked: item.isLiked, key: item.key })}
            disabled={isLiking}
          >
            <Icon
              name={`heart-${item.isLiked ? 'filled' : 'outline'}`}
            />
          </button>
          )}

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
          {enableTrade && (
          <Link href="/trades/request/[itemID]" as={`/trades/request/${item.key}`}>
            <a className="itemCard__button">
              <Icon name={`cart-${item.isTradingPartner ? 'filled' : 'outline'}`} />
            </a>
          </Link>
          )}

        </div>

        {/* TRADE REQUESTS */}
        <p className="itemCard__meta-subtext">
          {item.tradeRequests}
        </p>
      </div>
    </div>
  </div>
);

export default ItemCard;
