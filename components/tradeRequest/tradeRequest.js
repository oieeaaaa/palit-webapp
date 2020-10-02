/*
 ***************************************
Component: TradeRequest Components Index
Author: Joimee
Description:
 ***************************************
 */
import Link from 'next/link';
import { isObjectEmpty } from 'js/utils';
import MiniCard, { MiniCardSkeleton } from 'components/miniCard/miniCard';
import GoodLuckCard from 'components/goodLuckCard/goodLuckCard';
import ItemCard, { ItemCardSkeleton } from 'components/itemCard/itemCard';

/**
 * TradeRequestHeading.
 *
 * @param {string} text
 */
export const TradeRequestHeading = ({ text }) => (
  <h2 className="trade-request__heading">
    {text}
  </h2>
);

/**
 * TradeRequestMyItem.
 *
 * @param {object} myItem
 */
export const TradeRequestMyItem = ({ myItem }) => {
  if (isObjectEmpty(myItem)) return <MiniCardSkeleton className="trade-request__item" />;

  return (
    <Link href="/items/[itemID]" as={`/items/${myItem.key}`}>
      <a className="trade-request__item">
        <MiniCard data={{
          name: myItem.name,
          likes: myItem.likes,
          cover: myItem.cover,
        }}
        />
      </a>
    </Link>
  );
};

/**
 * TradeRequestGoodLuckCard.
 *
 * @param {object} tradeRequestItem
 */
export const TradeRequestGoodLuckCard = ({ tradeRequestItem }) => {
  const isTradeAccepted = tradeRequestItem && tradeRequestItem.isAccepted;

  if (!isTradeAccepted) return null;

  return (
    <>
      <TradeRequestHeading text="Traded Item" />
      <GoodLuckCard ownerID={tradeRequestItem.acceptedItem.owner} />
    </>
  );
};

/**
 * TradeRequestItemRequests.
 *
 * @param {object} tradeRequestItem
 * @param {function} onAcceptRequest
 * @param {function} onCancelRequest
 */
export const TradeRequestItemRequests = ({
  tradeRequestItem,
  onAcceptRequest,
  onCancelRequest,
}) => {
  const isRequestsExists = tradeRequestItem && tradeRequestItem.requests;

  if (!isRequestsExists) {
    return Array.from({ length: 6 }).map((_, index) => <ItemCardSkeleton key={index} />);
  }

  /**
   * checkIfCurrentItemIsAccepted.
   *
   * @param {object} currentItem
   */
  const checkIfCurrentItemIsAccepted = (currentItem) => (
    tradeRequestItem.isAccepted
    && tradeRequestItem.acceptedItem.key === currentItem.key
  );

  /**
   * cardButtonVariant.
   *
   * @param {object} currentItem
   * @param {string} defaultVariant
   */
  const cardButtonVariant = (currentItem, defaultVariant = '--default') => {
    let variant = '';
    const isCurrentItemAccepted = checkIfCurrentItemIsAccepted(currentItem);
    const isTradeRequestItemAccepted = !isCurrentItemAccepted && tradeRequestItem.isAccepted;
    const isCurrentItemTraded = currentItem.isTraded;

    if (isCurrentItemAccepted) {
      variant = '--success';
    } else if (isTradeRequestItemAccepted || isCurrentItemTraded) {
      variant = '--disabled';
    } else {
      variant = defaultVariant;
    }

    return `button ${variant}`;
  };

  /**
   * cardText.
   *
   * @param {object} tradeRequest
   * @param {string} text
   */
  const cardText = (tradeRequest, text = 'Click Me') => {
    let newText = '';

    if (checkIfCurrentItemIsAccepted(tradeRequest)) {
      newText = 'Accepted';
    } else if (tradeRequest.isTraded) {
      newText = 'Traded';
    } else {
      newText = text;
    }

    return newText;
  };

  /**
   * isCardButtonDisabled.
   *
   * @param {boolean} isTraded
   */
  const isCardButtonDisabled = (isTraded) => tradeRequestItem.isAccepted || isTraded;

  return tradeRequestItem.requests.map((tradeRequest) => (
    <div key={tradeRequest.key} className="trade-request__list-item">
      <ItemCard
        item={tradeRequest}
        linkOptions={{
          href: '/items/[itemID]',
          as: `/items/${tradeRequest.key}`,
        }}
      />
      {tradeRequest.isRequestor ? (
        <button
          type="button"
          className={cardButtonVariant(tradeRequest)}
          onClick={() => onAcceptRequest(tradeRequest)}
          disabled={isCardButtonDisabled(tradeRequest.isTraded)}
        >
          {cardText(tradeRequest, 'Accept Request')}
        </button>
      ) : (
        <button
          type="button"
          className={cardButtonVariant(tradeRequest, '--default --red-outline')}
          onClick={() => onCancelRequest(tradeRequest.key)}
          disabled={isCardButtonDisabled(tradeRequest.isTraded)}
        >
          {cardText(tradeRequest, 'Cancel Request')}
        </button>
      )}
    </div>
  ));
};

/**
 * TradeRequestEmpty.
 *
 * @param {boolean} isEmpty
 */
export const TradeRequestEmpty = ({ isEmpty }) => isEmpty && (
  <div className="tip">
    <h2 className="tip-heading">
      Empty:
    </h2>
    <p className="tip-text">
      Try to make a
      {' '}
      <Link href="/">
        <a className="tip-link">
          trade
        </a>
      </Link>
    </p>
  </div>
);

/**
 * TradeRequestFooter.
 *
 * @param {string} editKey
 * @param {function} onRemoveItem
 */
export const TradeRequestFooter = ({ editKey, onRemoveItem }) => (
  <div className="grid">
    <div className="trade-request__footer">
      <button type="button" className="button --dark --red-outline" onClick={onRemoveItem}>
        Delete
      </button>
      <Link href="/items/edit/[editItemID]" as={`/items/edit/${editKey}`}>
        <a className="button --primary">
          Edit
        </a>
      </Link>
    </div>
  </div>
);

export default {
  TradeRequestHeading,
  TradeRequestMyItem,
  TradeRequestGoodLuckCard,
  TradeRequestItemRequests,
  TradeRequestEmpty,
  TradeRequestFooter,
};
