import {
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import { useRouter } from 'next/router';
import useError from 'js/hooks/useError';
import AuthContext from 'js/contexts/auth';
import LayoutContext from 'js/contexts/layout';
import ITEM from 'js/models/item';
import TRADE_REQUEST from 'js/models/tradeRequest';
import useProtection from 'js/hooks/useProtection';

import Layout from 'components/layout/layout';
import {
  TradeRequestSelectItems,
  TradeRequestSelectEmpty,
  TradeRequestSelectFooter,
} from 'components/tradeRequestSelect/tradeRequestSelect';
import Title from 'components/title/title';

const TradeRequestSelect = () => {
  // customHooks
  const router = useRouter();
  const [displayError] = useError();

  // contexts
  const { user } = useContext(AuthContext);
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
   * @type {string} itemToTradeID
   */
  const getItemsToTrade = async (itemToTradeID) => {
    try {
      const data = await ITEM.getItemsToTrade(user.key, itemToTradeID);

      setItems(data);
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
          <Title>
            {checkItemsEmpty() ? 'No available items to trade' : 'Select an item to trade'}
          </Title>
          <div className="trade-request-select__list">
            <TradeRequestSelectItems
              items={items}
              selectedItemID={selectedItemID}
              onSelect={onSelect}
            />
            <TradeRequestSelectEmpty isEmpty={checkItemsEmpty()} />
          </div>
          <TradeRequestSelectFooter
            itemID={router.query.itemID}
            selectedItemID={selectedItemID}
            submitRequest={submitRequest}
          />
        </div>
      </div>
    </Layout>
  );
};

export default useProtection(TradeRequestSelect);
