import { db } from 'admin';
import { successPayload, errorPayload } from 'js/shapes/commons';
import {
  incrementTradeRequests,
  incrementTotalRequests,
} from 'js/shapes/tradeRequest';
import messages from 'js/messages';
import api from 'js/helpers/api';

const tradeRequestsCollection = db.collection('tradeRequests');
const itemsCollection = db.collection('items');
const requestsCollectionGroup = db.collectionGroup('requests');

/**
 * cancelRequest.
 *
 * @param {object} req
 * @param {object} res
 */
const cancelRequest = async (req, res) => {
  const { myItemID, itemToTradeID } = req.body;

  try {
    // CURRENT USER'S REFS
    const myItemRef = itemsCollection.doc(myItemID);
    const myTradeRequestRef = tradeRequestsCollection.doc(myItemID);
    const myRequestsItemRef = myTradeRequestRef.collection('requests').doc(itemToTradeID);
    const myRequestsStatsRef = myTradeRequestRef.collection('requests').doc('--stats--');
    const myRequests = await requestsCollectionGroup.where('key', '==', myItemID).get();

    // OTHER USER'S REFS
    const otherItemRef = itemsCollection.doc(itemToTradeID);
    const otherTradeRequestRef = tradeRequestsCollection.doc(itemToTradeID);
    const otherRequestsItemRef = otherTradeRequestRef.collection('requests').doc(myItemID);
    const otherRequestsStatsRef = otherTradeRequestRef.collection('requests').doc('--stats--');
    const otherRequests = await requestsCollectionGroup.where('key', '==', itemToTradeID).get();

    // aggregated requests
    const requests = [
      ...myRequests.docs,
      ...otherRequests.docs,
    ];

    await db.runTransaction(async (transaction) => {
      /* ========================================================================
      items
    ======================================================================== */
      transaction.set(myItemRef, incrementTradeRequests(-1), { merge: true });

      transaction.set(otherItemRef, incrementTradeRequests(-1), { merge: true });

      /* ========================================================================
      tradeRequests
    ======================================================================== */
      transaction.update(myTradeRequestRef, incrementTradeRequests(-1));

      transaction.update(otherTradeRequestRef, incrementTradeRequests(-1));

      /* ========================================================================
      tradeRequests > requests
    ======================================================================== */
      transaction.update(myRequestsStatsRef, incrementTotalRequests(-1));

      transaction.update(otherRequestsStatsRef, incrementTotalRequests(-1));

      requests.forEach((affectedItem) => {
        transaction.update(affectedItem.ref, incrementTradeRequests(-1));
      });

      transaction.delete(myRequestsItemRef);

      transaction.delete(otherRequestsItemRef);
    });

    successPayload(res, {
      message: messages.success.added,
    });
  } catch (error) {
    errorPayload(res, {
      message: messages.error.common,
      error: error.message,
    });
  }
};

export default api({ post: cancelRequest });
