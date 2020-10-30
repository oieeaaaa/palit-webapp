/* eslint no-nested-ternary: 0 */
import {
  useState,
  useEffect,
  useCallback,
  useContext,
} from 'react';
import fetch from 'node-fetch';
import { useRouter } from 'next/router';
import AuthContext from 'js/contexts/auth';
import LayoutContext from 'js/contexts/layout';
import useError from 'js/hooks/useError';
import TRADE_REQUESTS from 'js/models/tradeRequest';
import ITEM from 'js/models/item';
import USER from 'js/models/user';
import useProtection from 'js/hooks/useProtection';
import useInfiniteScroll from 'js/hooks/useInfiniteScroll';
import { normalizeData, isObjectEmpty } from 'js/utils';

import Layout from 'components/layout/layout';
import {
  TradeRequestMyItem,
  TradeRequestGoodLuckCard,
  TradeRequestItemRequests,
  TradeRequestEmpty,
  TradeRequestFooter,
} from 'components/tradeRequest/tradeRequest';
import Title from 'components/title/title';

const TradeItem = () => {
  // contexts
  const { handlers } = useContext(LayoutContext);
  const { user } = useContext(AuthContext);

  // states
  const [tradeRequestItem, setTradeRequestItem] = useState(null);
  const [tradeRequestItemStats, setTradeRequestItemStats] = useState(null);
  const [myItem, setMyItem] = useState({});

  // callbacks
  const checkIfRequestsIsEmpty = useCallback(() => (
    tradeRequestItem && !tradeRequestItem.requests.length
  ), [tradeRequestItem]);

  // custom hooks
  const router = useRouter();
  const [displayError] = useError();
  const { isFetching: isFetchingTradeRequests } = useInfiniteScroll(
    getItemTradeRequests,
    tradeRequestItemStats?.totalRequests,
  );

  /**
   * getMyItem
   */
  const getMyItem = async () => {
    try {
      const { itemID } = router.query;
      const rawMyItem = await ITEM.getOne(itemID);
      const item = normalizeData(rawMyItem);

      if (item.isDirty) {
        await ITEM.cleanDirty(itemID);
      }

      setMyItem(item);
    } catch (err) {
      displayError(err);
    }
  };

  const getItemTradeRequestsStats = async () => {
    try {
      const { itemID } = router.query;
      const rawStats = await TRADE_REQUESTS.getRequestsStats(itemID);

      setTradeRequestItemStats(rawStats.data());
    } catch (err) {
      displayError(err);
    }
  };

  /**
   * getItemTradeRequests
   *
   * It should fetch the item's trade requests
   */
  async function getItemTradeRequests(limit) {
    if (isFetchingTradeRequests) return;

    try {
      const { itemID } = router.query;
      const data = await TRADE_REQUESTS.getOne(itemID, limit);

      setTradeRequestItem(data);
    } catch (err) {
      displayError(err);
    }
  }

  /**
   * onCancelRequest
   *
   * @param {string} requestedItemKey
   */
  const onCancelRequest = async (requestedItemKey) => {
    try {
      await TRADE_REQUESTS.cancel(myItem.key, requestedItemKey);

      setTradeRequestItem((prevTradeRequests) => {
        const itemsWithoutRequestedItem = ({
          ...prevTradeRequests,
          requests: prevTradeRequests.requests.filter(
            (prevTradeRequest) => (prevTradeRequest.key !== requestedItemKey),
          ),
        });

        return itemsWithoutRequestedItem;
      });
    } catch (err) {
      displayError(err);
    }
  };

  /**
   * onAcceptRequest.
   *
   * Fetch Partner's data from the database
   * Send email
   * Send the update data to the database if emails is sent
   * Update the UI
   *
   * @param {object} itemToAccept
   */
  const onAcceptRequest = async (itemToAccept) => {
    try {
      const rawPartner = await USER.getOne(itemToAccept.owner);
      const partner = normalizeData(rawPartner);

      // Send email to the owner of the accepted item
      const rawRes = await fetch('/api/trade-request-accepted', {
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify({
          myItem,
          myContact: user,
          partnerItem: itemToAccept,
          partnerContact: partner,
        }),
      });

      // parsed rawRes
      const isEmailSend = await rawRes.json();

      if (isEmailSend) {
        // update database
        await TRADE_REQUESTS.accept(myItem, itemToAccept);

        // update view
        setTradeRequestItem((prevTradeRequests) => ({
          ...prevTradeRequests,
          isAccepted: true,
          isTraded: true,
          acceptedItem: {
            key: itemToAccept.key,
            owner: itemToAccept.owner,
          },
        }));
      }
    } catch (err) {
      displayError(err);
    }
  };

  /**
   * removeItem
   */
  const removeItem = async () => {
    try {
      await ITEM.remove(myItem.key);

      // redirect to inventory
      router.push('/inventory', '/inventory');

      handlers.showBanner({
        text: `Deleted ${myItem.name} 🔥`,
        variant: 'info',
      });
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

    if (isObjectEmpty(myItem) && !tradeRequestItemStats) {
      getMyItem();
      getItemTradeRequestsStats();
      getItemTradeRequests();
    }
  }, [router]);

  return (
    <Layout title="Trades List">
      <div className="trade-request">
        <div className="grid">
          <Title>My Item</Title>
          <TradeRequestMyItem myItem={myItem} />
          <TradeRequestGoodLuckCard tradeRequestItem={tradeRequestItem} />
          <Title>Trade Requests</Title>
          <div className="trade-request__list">
            <TradeRequestItemRequests
              tradeRequestItem={tradeRequestItem}
              onAcceptRequest={onAcceptRequest}
              onCancelRequest={onCancelRequest}
            />
            <TradeRequestEmpty isEmpty={checkIfRequestsIsEmpty()} />
          </div>
          <TradeRequestFooter editKey={myItem.key} onRemoveItem={removeItem} />
        </div>
      </div>
    </Layout>
  );
};

export default useProtection(TradeItem);
