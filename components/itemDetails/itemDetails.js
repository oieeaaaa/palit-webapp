/*
***************************************
Component: ItemDetails
Author: Joimee
Description:
***************************************
*/
import Link from 'next/link';
import Icon from 'components/icon/icon';

/**
 * ItemDetailsImageGroup.
 *
 * @param {object}
   * @param {string} cover
   * @param {string} name
 */
export const ItemDetailsImageGroup = ({ cover, name }) => (
  <figure className="item__image">
    <img src={cover} alt={name} />
  </figure>
);

/**
 * ItemDetailsTitle.
 *
 * @param {object}
   * @param {string} name
 */
export const ItemDetailsTitle = ({ name }) => (
  <h1 className="item__title">
    {name}
  </h1>
);

/**
 * ItemDetailsCard.
 *
 * @param {object}
   * @param {object} children
   * @param {string} variant
 */
export const ItemDetailsCard = ({ children, variant = '--info' }) => (
  <div className={`item-card --${variant}`}>
    {children}
  </div>
);

/**
 * ItemDetailsCardTitle.
 *
 * @param {object}
   * @param {string} text
 */
export const ItemDetailsCardTitle = ({ text }) => (
  <h2 className="item-card__title">
    {text}
  </h2>
);

/**
 * ItemDetailsCardLink.
 *
 * @param {object}
   * @param {string} text
 */
export const ItemDetailsCardLink = ({ children, ...rest }) => (
  <Link {...rest}>
    <a className="item-card__link">
      {children}
    </a>
  </Link>
);

/**
 * ItemDetailsCardDetails.
 *
 * @param {object}
 */
export const ItemDetailsCardDetails = ({ details }) => (
  <ul className="item-card__details">
    {details.map((detail) => (
      <li className="item-card__item" key={detail.label}>
        {detail.label}
        :
        {' '}
        <strong>{detail.value}</strong>
      </li>
    ))}
  </ul>
);

/**
 * ItemDetailsCardRemarks.
 *
 * @param {object}
   * @param {string} remarks
 */
export const ItemDetailsCardRemarks = ({ remarks }) => (
  <div className="item-card__details">
    <p className="item-card__text">
      {remarks}
    </p>
  </div>
);

/**
 * ItemDetailsOwnedActions.
 *
 * @param {object}
   * @param {string} itemKey
   * @param {function} removeItem
 */
export const ItemDetailsOwnedActions = ({
  itemKey,
  removeItem,
}) => (
  <>
    <Link href="/items/edit/[editItemID]" as={`/items/edit/${itemKey}`}>
      <a className="button --primary item__edit">
        <span>Edit</span>
      </a>
    </Link>
    <button
      className="button --dark --red-outline item__delete"
      type="button"
      onClick={removeItem}
    >
      <span>Delete</span>
    </button>
  </>
);

/**
 * ItemDetailsUnownedActions.
 *
 * @param {object}
   * @param {function} onLike
   * @param {boolean} isLiking
   * @param {boolean} isLiked
   * @param {string} itemKey
 */
export const ItemDetailsUnownedActions = ({
  onLike,
  isLiking,
  isLiked,
  itemKey,
  isTraded,
}) => (
  <>
    <button
      className="button --default item__like"
      type="button"
      onClick={onLike}
      disabled={isLiking}
    >
      <Icon className="button-icon" name={`heart-${isLiked ? 'filled' : 'outline'}`} />
      <span>Like</span>
    </button>
    {isTraded ? (
      <button className="button --disabled" disabled type="button">
        Traded
      </button>
    ) : (
      <Link href="/trades/request/[itemID]" as={`/trades/request/${itemKey}`}>
        <a className="button --primary-dark item__trade">
          <Icon className="button-icon" name="cart-filled" />
          <span>{isTraded ? 'Traded' : 'Trade Requests'}</span>
        </a>
      </Link>
    )}
  </>
);

export default {
  ItemDetailsImageGroup,
  ItemDetailsTitle,
  ItemDetailsCard,
  ItemDetailsCardTitle,
  ItemDetailsCardDetails,
  ItemDetailsCardRemarks,
  ItemDetailsOwnedActions,
  ItemDetailsUnownedActions,
  ItemDetailsCardLink,
};
