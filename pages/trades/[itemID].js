/* eslint no-nested-ternary: 0 */
import {
  useState,
  useEffect,
  useCallback,
  useContext,
} from 'react';
import fetch from 'node-fetch';
import { useRouter } from 'next/router';
import Link from 'next/link';
import UserContext from 'js/contexts/user';
import LayoutContext from 'js/contexts/layout';
import useError from 'js/hooks/useError';
import TRADE_REQUESTS from 'js/models/tradeRequest';
import ITEM from 'js/models/item';
import USER from 'js/models/user';
import useProtection from 'js/hooks/useProtection';
import { normalizeData } from 'js/utils';
import Layout from 'components/layout/layout';
import ItemCard, { ItemCardSkeleton } from 'components/itemCard/itemCard';
import MiniCard, { MiniCardSkeleton } from 'components/miniCard/miniCard';
import GoodLuckCard from 'components/goodLuckCard/goodLuckCard';

const TradeItem = () => {
  const { handlers } = useContext(LayoutContext);
  const user = useContext(UserContext);

  // custom hooks
  const router = useRouter();
  const [displayError] = useError();

  // states
  const [tradeRequestItem, setTradeRequestItem] = useState(null);
  const [myItem, setMyItem] = useState({});

  // callbacks
  const checkIfRequestsIsEmpty = useCallback(() => (
    tradeRequestItem && !tradeRequestItem.requests.length
  ), [tradeRequestItem]);

  /**
   * getMyItem
   *
   * @param {string} itemID
   */
  const getMyItem = async (itemID) => {
    try {
      const rawMyItem = await ITEM.getOne(itemID);

      setMyItem(normalizeData(rawMyItem));
    } catch (err) {
      displayError(err);
    }
  };

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
      await TRADE_REQUESTS.remove(myItem.key, itemToTradeID);

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
   * Fetch Partner's data from the database
   * Send email
   * Save the update to the database if emails is sent
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
          myItem: {
            name: myItem.name,
            likes: myItem.likes,
            tradeRequests: myItem.tradeRequests,
          },
          myContact: {
            email: user.email,
            phoneNumber: user.phoneNumber,
            messengerLink: user.messengerLink,
          },
          partnerItem: {
            name: itemToAccept.name,
            likes: itemToAccept.likes,
            tradeRequests: itemToAccept.tradeRequests,
          },
          partnerContact: {
            email: partner.email,
            phoneNumber: partner.phoneNumber,
            messengerLink: partner.messengerLink,
          },
        }),
      });
      const isEmailSend = await rawRes.json();

      if (isEmailSend) {
        // update database
        await TRADE_REQUESTS.acceptRequest(myItem, itemToAccept);

        // update view
        setTradeRequestItem((prevTradeRequests) => ({
          ...prevTradeRequests,
          isAccepted: true,
          isTraded: true,
          acceptedItem: itemToAccept,
        }));
      }
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
   * removeItem
   */
  const removeItem = async () => {
    try {
      await ITEM.remove(myItem.key);

      // redirect to inventory after delete
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

    getItemTradeRequests(itemID);
    getMyItem(itemID);
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
          {myItem ? (
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
          ) : <MiniCardSkeleton className="trade-request__item" />}
          {(tradeRequestItem && tradeRequestItem.isAccepted) && (
            <>
              <h2 className="trade-request__heading">
                Traded Item
              </h2>
              <GoodLuckCard ownerID={tradeRequestItem.acceptedItem.owner} />
            </>
          )}
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
                      disabled={tradeRequestItem.isAccepted || tradeRequest.isTraded}
                    >
                      {checkIfCurrentItemIsAccepted(tradeRequest) ? 'Accepted' : tradeRequest.isTraded ? 'Traded' : 'Accept Request'}
                    </button>
                  ) : (
                    <button
                      type="button"
                      className={getButtonVariant(tradeRequest, '--default --red-outline')}
                      onClick={() => onCancelRequest(tradeRequest.key)}
                      disabled={tradeRequestItem.isAccepted || tradeRequest.isTraded}
                    >
                      {checkIfCurrentItemIsAccepted(tradeRequest) ? 'Accepted' : tradeRequest.isTraded ? 'Traded' : 'Cancel Request'}
                    </button>
                  )}
                </div>
              ))
            ) : (
              Array.from({ length: 6 }).map((_, index) => <ItemCardSkeleton key={index} />)
            )}

            {checkIfRequestsIsEmpty() && (
              <div className="tip">
                <h2 className="tip-heading">
                  No traded items yet:
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
            )}
          </div>
        </div>
        <div className="grid">
          <div className="trade-request__footer">
            <button type="button" className="button --dark --red-outline" onClick={removeItem}>
              Delete
            </button>
            <Link href="/items/edit/[editItemID]" as={`/items/edit/${myItem.key}`}>
              <a className="button --primary">
                Edit
              </a>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default useProtection(TradeItem);
