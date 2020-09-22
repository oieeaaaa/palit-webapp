import { useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import UserContext from 'js/contexts/user';
import LayoutContext from 'js/contexts/layout';
import ITEM from 'js/models/item';
import TRADE_REQUEST from 'js/models/tradeRequest';
import { normalizeData } from 'js/utils';

import Layout from 'components/layout/layout';
import MiniCard from 'components/miniCard/miniCard';

export default () => {
  const router = useRouter();
  const user = useContext(UserContext);
  const { handlers } = useContext(LayoutContext);
  const [itemToTrade, setItemToTrade] = useState({});
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState(null);

  /**
   * getUserItems.
   *
   * It should fetch user items
   * TODO: Items should have a value of isTraded set to false
   *
   * @type {string} itemID
   */
  const getUserItems = async () => {
    try {
      const rawData = await ITEM.getItemsAtUser(user.id);

      setItems(normalizeData(rawData));
    } catch (err) {
      console.error(err.message);
    }
  };

  /**
   * getItemToTrade.
   *
   * @param {string} itemID
   */
  const getItemToTrade = async (itemID) => {
    try {
      const rawData = await ITEM.getOne(itemID);

      setItemToTrade({
        ...rawData.data(),
        key: rawData.id,
      });
    } catch (err) {
      handlers.showBanner({
        error: err.message,
        variant: 'error',
      });
    }
  };

  /**
   * submitRequest.
   */
  const submitRequest = async () => {
    try {
      // get the whole data of the selected item
      // using the selected state
      const myItem = items.find((item) => item.key === selected);

      // Send the request to firestore
      await TRADE_REQUEST.add(myItem, itemToTrade);

      // display some nice success message
      handlers.showBanner({
        text: 'Good choice! 🎉',
        variant: 'success',
      });

      // Redirect to the trade requests page
      setTimeout(() => {
        router.push(
          '/trades/[itemID]',
          `/trades/${myItem.key}`,
          { shallow: true },
        );
      }, 300);
    } catch (err) {
      handlers.showBanner({
        error: err.message,
        variant: 'error',
      });
    }
  };

  /**
   * onSelect.
   *
   * @param {string} key
   */
  const onSelect = (key) => {
    setSelected(key);
  };

  useEffect(() => {
    const { itemID } = router.query;

    if (!itemID) return;

    getUserItems();
    getItemToTrade(itemID);
  }, [router]);

  return (
    <Layout title="Trade Request Form">
      <div className="trade-request-select">
        <div className="grid">
          <h2 className="trade-request-select__heading">
            Select an item to trade
          </h2>
          <div className="trade-request-select__list">
            {items.map((item) => (
              <button
                key={item.key}
                className={`trade-request-select__option ${item.key === selected ? ' --selected' : ''}`}
                type="button"
                onClick={() => onSelect(item.key)}
              >
                <MiniCard
                  data={item}
                />
              </button>
            ))}
          </div>
          <div className="trade-request-select__footer">
            <Link href="/items/[itemID]" as={`/items/${router.query.itemID}`}>
              <a className="button --default trade-request-select__cancel">
                Cancel
              </a>
            </Link>
            <button
              className={`button --primary trade-request-select__submit ${!selected ? '--disabled' : ''}`}
              type="button"
              onClick={submitRequest}
              disabled={!selected}
            >
              Submit Request
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};
