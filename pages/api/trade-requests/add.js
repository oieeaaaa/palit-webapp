import { db } from 'admin';
import { successPayload, errorPayload } from 'js/shapes/commons';
import {
  newTradeRequest,
  newRequest,
  incrementTradeRequests,
  incrementTotalRequests,
} from 'js/shapes/tradeRequest';
import messages from 'js/messages';
import api from 'js/helpers/api';

const tradeRequestsCollection = db.collection('tradeRequests');
const itemsCollection = db.collection('items');
const requestsCollectionGroup = db.collectionGroup('requests');

/**
 * addTradeRequest.
 *
 * @param {object} req
 * @param {object} res
 */
const addTradeRequest = async (req, res) => {
  const { myItem, itemToTrade } = req.body;

  try {
    const myRequests = await requestsCollectionGroup.where('key', '==', myItem.key).get();
    const otherRequests = await requestsCollectionGroup.where('key', '==', itemToTrade.key).get();
    const requests = [
      ...myRequests.docs,
      ...otherRequests.docs,
    ];

    // CURRENT USER's REFS
    const myItemRef = itemsCollection.doc(myItem.key);
    const myTradeRequestRef = tradeRequestsCollection.doc(myItem.key);
    const myNewRequestsItemRef = myTradeRequestRef.collection('requests').doc(itemToTrade.key);
    const myRequestsStatsRef = myTradeRequestRef.collection('requests').doc('--stats--');

    // OTHER USER's REFS
    const otherItemRef = itemsCollection.doc(itemToTrade.key);
    const otherTradeRequestRef = tradeRequestsCollection.doc(itemToTrade.key);
    const otherNewRequestsItemRef = otherTradeRequestRef.collection('requests').doc(myItem.key);
    const otherRequestsStatsRef = otherTradeRequestRef.collection('requests').doc('--stats--');

    await db.runTransaction(async (transaction) => {
      /* ========================================================================
      items
    ======================================================================== */

      transaction.update(myItemRef, { isTrading: true });

      transaction.update(otherItemRef, { isTrading: true });

      transaction.update(itemsCollection.doc(myItem.key), incrementTradeRequests(1));

      transaction.update(itemsCollection.doc(itemToTrade.key), {
        ...incrementTradeRequests(1),
        isDirty: true,
      });

      /* ========================================================================
      tradeRequests
    ======================================================================== */

      transaction.set(myTradeRequestRef, newTradeRequest(myItem));

      transaction.set(otherTradeRequestRef, newTradeRequest(itemToTrade));

      /* ========================================================================
      tradeRequests > requests
    ======================================================================== */

      transaction.set(myRequestsStatsRef, incrementTotalRequests(1), { merge: true });

      transaction.set(otherRequestsStatsRef, incrementTotalRequests(1), { merge: true });

      transaction.set(myNewRequestsItemRef, newRequest(itemToTrade));

      transaction.set(otherNewRequestsItemRef, {
        ...newRequest(myItem),
        isRequestor: true,
      });

      requests.forEach((request) => {
        transaction.update(request.ref, incrementTradeRequests(1));
      });
    });

    successPayload(res, {
      myItemKey: myItem.key,
      itemToTradeKey: itemToTrade.key,
      message: messages.success.added,
    });
  } catch (error) {
    errorPayload(res, {
      message: messages.error.common,
      error: error.message,
    });
  }
};

export default api({ post: addTradeRequest });
