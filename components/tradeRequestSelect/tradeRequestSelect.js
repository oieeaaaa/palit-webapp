/*
***************************************
Component: TradeRequestSelect
Author: Joimee
Description:
***************************************
*/
import Link from 'next/link';
import MiniCard, { MiniCardSkeleton } from 'components/miniCard/miniCard';

/**
 * TradeRequestSelectHeading.
 *
 * @param {object}
   * @param {string} text
 */
export const TradeRequestSelectHeading = ({ text }) => (
  <h2 className="trade-request-select__heading">
    {text}
  </h2>
);

/**
 * TradeRequestSelectItems.
 *
 * @param {object}
   * @param {array} items
   * @param {string} selectedItemID
   * @param {function} onSelect
 */
export const TradeRequestSelectItems = ({ items, selectedItemID, onSelect }) => (
  items ? items.map((item) => (
    <button
      key={item.key}
      className={`trade-request-select__option ${item.key === selectedItemID ? ' --selected' : ''}`}
      type="button"
      onClick={() => onSelect(item.key)}
    >
      <MiniCard
        data={item}
      />
    </button>
  )) : (
    Array.from({ length: 5 }).map((_, index) => <MiniCardSkeleton key={index} />)
  )
);

/**
 * TradeRequestSelectEmpty.
 *
 * @param {object}
   * @param {boolean} isEmpty
 */
export const TradeRequestSelectEmpty = ({ isEmpty }) => isEmpty && (
  <div className="tip">
    <strong className="tip-heading">Tip:</strong>
    <p className="tip-text">
      Add more items in your
      {' '}
      <Link href="/inventory">
        <a className="tip-link">
          inventory
        </a>
      </Link>
      {' '}
      to keep trading
    </p>
  </div>
);

/**
 * TradeRequestSelectFooter.
 *
 * @param {object}
   * @param {string} itemID
   * @param {string} selectedItemID
   * @param {function} submitRequest
 */
export const TradeRequestSelectFooter = ({ itemID, selectedItemID, submitRequest }) => (
  <div className="trade-request-select__footer">
    <Link href="/items/[itemID]" as={`/items/${itemID}`}>
      <a className="button --default trade-request-select__cancel">
        Cancel
      </a>
    </Link>
    <button
      className={`button --primary trade-request-select__submit ${!selectedItemID ? '--disabled' : ''}`}
      type="button"
      onClick={submitRequest}
      disabled={!selectedItemID}
    >
      Submit Request
    </button>
  </div>

);

export default {
  TradeRequestSelectHeading,
  TradeRequestSelectEmpty,
  TradeRequestSelectFooter,
};
