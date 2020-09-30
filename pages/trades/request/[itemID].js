import {
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import useError from 'js/hooks/useError';
import UserContext from 'js/contexts/user';
import LayoutContext from 'js/contexts/layout';
import ITEM from 'js/models/item';
import TRADE_REQUEST from 'js/models/tradeRequest';
import useProtection from 'js/hooks/useProtection';
import { normalizeData } from 'js/utils';

import Layout from 'components/layout/layout';
import MiniCard, { MiniCardSkeleton } from 'components/miniCard/miniCard';

const TradeRequestSelect = () => {
  // customHooks
  const router = useRouter();
  const [displayError] = useError();

  // contexts
  const user = useContext(UserContext);
  const { handlers } = useContext(LayoutContext);

  // states
  const [itemToTrade, setItemToTrade] = useState({});
  const [items, setItems] = useState(null);
  const [selectedItemID, setSelectedItemID] = useState(null);

  // callbacks
  const checkItemsEmpty = useCallback(() => !!(items && !items.length), [items]);

  /**
   * getItemsToTrade.
   *
   * It should fetch user items
   *
   * @type {string} itemID
   */
  const getItemsToTrade = async () => {
    try {
      const data = await ITEM.getItemsToTrade(user.key);

      setItems(normalizeData(data));
    } catch (err) {
      displayError(err);
    }
  };

  /**
   * getSelectedItem.
   *
   * @param {string} itemID
   */
  const getSelectedItem = async (itemID) => {
    try {
      const rawItem = await ITEM.getOne(itemID);

      setItemToTrade({
        ...rawItem.data(),
        key: rawItem.id,
      });
    } catch (err) {
      displayError(err);
    }
  };

  /**
   * submitRequest.
   */
  const submitRequest = async () => {
    try {
      // get the whole data of the selected item
      // using the selected state
      const myItem = items.find((item) => item.key === selectedItemID);

      // Send the request to firestore
      await TRADE_REQUEST.add(myItem, itemToTrade);

      // display some nice success message
      handlers.showBanner({
        text: `Traded ${myItem.name} 🎉`,
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
      displayError(err);
    }
  };

  /**
   * onSelect.
   *
   * @param {string} key
   */
  const onSelect = (itemID) => {
    let selectedKey = itemID;

    if (itemID === selectedItemID) {
      selectedKey = null;
    }

    setSelectedItemID(selectedKey);
  };

  useEffect(() => {
    const { itemID } = router.query;

    if (!itemID || !user.key) return;

    getItemsToTrade(itemID);
    getSelectedItem(itemID);
  }, [router, user]);

  return (
    <Layout title="Trade Request Form">
      <div className="trade-request-select">
        <div className="grid">
          <h2 className="trade-request-select__heading">
            {checkItemsEmpty() ? 'No available items to trade' : 'Select an item to trade'}
          </h2>
          <div className="trade-request-select__list">
            {items ? items.map((item) => (
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
            )}

            {checkItemsEmpty() && (
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
            )}
          </div>
          <div className="trade-request-select__footer">
            <Link href="/items/[itemID]" as={`/items/${router.query.itemID}`}>
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
        </div>
      </div>
    </Layout>
  );
};

export default useProtection(TradeRequestSelect);
