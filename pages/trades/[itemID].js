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
   * useEffect.
   */
  useEffect(() => {
    const { itemID } = router.query;
    if (!itemID) return;

    getItemTradeRequests(itemID);
  }, [router]);

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
                      className="button --default"
                    >
                      Accept Request
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="button --default --red-outline"
                      onClick={() => onCancelRequest(tradeRequest.key)}
                    >
                      Cancel Request
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
