/* eslint no-nested-ternary: 0 */
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import useError from 'js/hooks/useError';
import TRADE_REQUESTS from 'js/models/tradeRequest';
import Layout from 'components/layout/layout';
import ItemCard, { ItemCardSkeleton } from 'components/itemCard/itemCard';
import MiniCard, { MiniCardSkeleton } from 'components/miniCard/miniCard';

export default () => {
  // custom hooks
  const router = useRouter();
  const [displayError] = useError();

  // states
  const [tradeRequestItem, setTradeRequestItem] = useState(null);

  /**
   * getItemTradeRequests
   *
   * It should fetch the item's trade requests
   *
   * @param {string} itemID
   */
  const getItemTradeRequests = async (itemID) => {
    try {
      const data = await TRADE_REQUESTS.getOne(itemID);

      setTradeRequestItem(data);
    } catch (err) {
      displayError(err);
    }
  };

  /**
   * onCancelRequest
   *
   * @param {itemToTradeID}
   */
  const onCancelRequest = async (itemToTradeID) => {
    try {
      await TRADE_REQUESTS.remove(tradeRequestItem.key, itemToTradeID);

      setTradeRequestItem((prevTradeRequests) => ({
        ...prevTradeRequests,
        requests: prevTradeRequests.requests.filter(
          (prevTradeRequest) => (prevTradeRequest.key !== itemToTradeID),
        ),
      }));
    } catch (err) {
      displayError(err);
    }
  };

  /**
   * onAcceptRequest.
   *
   * @param {object} itemToAccept
   */
  const onAcceptRequest = async (itemToAccept) => {
    const { requests, ...myItem } = tradeRequestItem;

    try {
      await TRADE_REQUESTS.acceptRequest(myItem, itemToAccept);

      setTradeRequestItem((prevTradeRequests) => ({
        ...prevTradeRequests,
        isAccepted: true,
        isTraded: true,
        acceptedItem: itemToAccept,
      }));
    } catch (err) {
      displayError(err);
    }
  };

  const checkIfCurrentItemIsAccepted = (currentItem) => (
    tradeRequestItem.isAccepted
    && tradeRequestItem.acceptedItem.key === currentItem.key
  );

  /**
   * getButtonVariant.
   *
   * @param {object} currentItem
   * @param {string} defaultVariant
   */
  const getButtonVariant = (currentItem, defaultVariant = '--default') => {
    let variant = '';

    // TODO: Make this easy to read
    if (checkIfCurrentItemIsAccepted(currentItem)) {
      variant = '--success';
    } else if (
      (
        !checkIfCurrentItemIsAccepted(currentItem)
        && tradeRequestItem.isAccepted
      )
      || currentItem.isTraded
    ) {
      variant = '--disabled';
    } else {
      variant = defaultVariant;
    }

    return `button ${variant}`;
  };

  /**
   * useEffect.
   */
  useEffect(() => {
    const { itemID } = router.query;
    if (!itemID) return;

    getItemTradeRequests(itemID);
  }, [router]);

  // Warning: The jsx below is a little messy right now, Blame Joimee 👈
  // TODO: Make this easy to read
  return (
    <Layout title="Trades List">
      <div className="trade-request">
        <div className="grid">
          <h2 className="trade-request__heading">
            My Item
          </h2>
          {tradeRequestItem ? (
            <Link href="/items/[itemID]" as={`/items/${tradeRequestItem.key}`}>
              <a className="trade-request__item">
                <MiniCard data={{
                  name: tradeRequestItem.name,
                  likes: tradeRequestItem.likes,
                  cover: tradeRequestItem.cover,
                }}
                />
              </a>
            </Link>
          ) : <MiniCardSkeleton className="trade-request__item" />}
          <h2 className="trade-request__heading">
            Trade Requests
          </h2>
          <div className="trade-request__list">
            {(tradeRequestItem && tradeRequestItem.requests) ? (
              tradeRequestItem.requests.map((tradeRequest) => (
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
                      className={getButtonVariant(tradeRequest)}
                      onClick={() => onAcceptRequest(tradeRequest)}
                      disabled={tradeRequestItem.isAccepted}
                    >
                      {checkIfCurrentItemIsAccepted(tradeRequest) ? 'Accepted' : tradeRequest.isTraded ? 'Traded' : 'Accept Request'}
                    </button>
                  ) : (
                    <button
                      type="button"
                      className={getButtonVariant(tradeRequest, '--default --red-outline')}
                      onClick={() => onCancelRequest(tradeRequest.key)}
                      disabled={tradeRequestItem.isAccepted || tradeRequestItem.isTraded}
                    >
                      {checkIfCurrentItemIsAccepted(tradeRequest) ? 'Accepted' : tradeRequest.isTraded ? 'Traded' : 'Cancel Request'}
                    </button>
                  )}
                </div>
              ))
            ) : (
              Array.from({ length: 6 }).map((_, index) => <ItemCardSkeleton key={index} />)
            )}
          </div>
          <div className="trade-request__footer">
            <button type="button" className="button --dark --red-outline">
              Delete
            </button>
            <button type="button" className="button --primary">
              Edit
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};
