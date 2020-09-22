import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import LayoutContext from 'js/contexts/layout';
import ITEM from 'js/models/item';
import TRADE_REQUESTS from 'js/models/tradeRequest';
import Layout from 'components/layout/layout';
import ItemCard from 'components/itemCard/itemCard';
import MiniCard from 'components/miniCard/miniCard';

export default () => {
  const [item, setItem] = useState({});
  const { handlers } = useContext(LayoutContext);
  const [tradeRequests, setTradeRequests] = useState({
    isAccepted: false,
    requests: [],
  });
  const router = useRouter();

  /**
   * getItem.
   *
   * It should fetch the item
   *
   * @param {string} key
   */
  const getItem = async (key) => {
    try {
      const rawData = await ITEM.getOne(key);
      const data = rawData.data();

      setItem({
        ...data,
        key: rawData.id,
      });
    } catch (err) {
      console.error(err);
    }
  };

  /**
   * getItemTradeRequests
   *
   * It should fetch the item's trade requests
   *
   * @type {string} string
   */
  const getItemTradeRequests = async (itemID) => {
    try {
      const data = await TRADE_REQUESTS.getOne(itemID);

      setTradeRequests(data);
    } catch (err) {
      handlers.showBanner({
        variant: 'variant',
        text: err.message,
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
    getItemTradeRequests(itemID);
  }, [router]);

  return (
    <Layout title={item.name}>
      <div className="trade-request">
        <div className="grid">
          <h2 className="trade-request__heading">
            My Item
          </h2>
          <Link href="/items/[itemID]" as={`/items/${item.key}`}>
            <a className="trade-request__item">
              <MiniCard data={item} />
            </a>
          </Link>
          <h2 className="trade-request__heading">
            Trade Requests
          </h2>
          <div className="trade-request__list">
            {tradeRequests.requests.length && (
              tradeRequests.requests.map((tradeRequest) => (
                <div key={tradeRequest.key} className="trade-request__list-item">
                  <ItemCard
                    item={tradeRequest}
                    onLike={() => {}}
                    linkOptions={{
                      href: '/items/[itemID]',
                      as: `/items/${tradeRequest.key}`,
                    }}
                  />
                  <button type="button" className="button --default">
                    Accept Request
                  </button>
                </div>
              ))
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
