import { db } from 'admin';
import { successPayload, errorPayload } from 'js/shapes/commons';
import { acceptedItemStatus, acceptedTradeRequest } from 'js/shapes/tradeRequest';
import messages from 'js/messages';
import api from 'js/helpers/api';

const tradeRequestsCollection = db.collection('tradeRequests');
const itemsCollection = db.collection('items');
const requestsCollectionGroup = db.collectionGroup('requests');

/**
 * acceptRequest.
 *
 * @param {object} req
 * @param {object} res
 */
const acceptRequest = async (req, res) => {
  const { myItem, itemToAccept } = req.body;

  try {
    // refs
    const myItemRef = itemsCollection.doc(myItem.key);
    const itemToAcceptRef = itemsCollection.doc(itemToAccept.key);
    const myTradeRequestsRef = tradeRequestsCollection.doc(myItem.key);
    const itemToAcceptTradeRequestsRef = tradeRequestsCollection.doc(itemToAccept.key);

    // requests
    const myRequests = await requestsCollectionGroup.where('key', '==', myItem.key).get();
    const itemToAcceptRequests = await requestsCollectionGroup.where('key', '==', itemToAccept.key).get();

    const requests = [
      ...myRequests.docs,
      ...itemToAcceptRequests.docs,
    ];

    await db.runTransaction(async (transaction) => {
      /* ========================================================================
      items
    ======================================================================== */

      transaction.update(myItemRef, acceptedItemStatus());

      transaction.update(itemToAcceptRef, {
        ...acceptedItemStatus(),
        isDirty: true,
      });

      /* ========================================================================
      tradeRequests
    ======================================================================== */

      transaction.update(myTradeRequestsRef, acceptedTradeRequest(itemToAccept));

      transaction.update(itemToAcceptTradeRequestsRef, acceptedTradeRequest(myItem));

      /* ========================================================================
      tradeRequests > requests
    ======================================================================== */

      requests.forEach((requestItem) => {
        transaction.update(requestItem.ref, acceptedItemStatus());
      });
    });

    successPayload(res, {
      myItemKey: myItem.key,
      acceptedItem: itemToAccept.key,
      message: messages.success.common,
    });
  } catch (error) {
    errorPayload(res, {
      message: messages.error.common,
      error: error.message,
    });
  }
};

export default api({ post: acceptRequest });
