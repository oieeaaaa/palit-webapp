import { db } from 'admin';

// shapes
import {
  incrementTotalItems,
  updatedItem,
} from 'js/shapes/item';
import {
  incrementTotalRequests,
  incrementTradeRequests,
} from 'js/shapes/tradeRequest';

// utils
import { normalizeData } from 'js/utils';
import api from 'js/helpers/api';

// collections
const itemsCollection = db.collection('items');
const itemsStats = db.collection('items').doc('--stats--');
const likesCollection = db.collection('likes');
const tradeRequestsCollection = db.collection('tradeRequests');
const requestsCollection = db.collectionGroup('requests');

/**
 * getOneItem.
 *
 * @param {object} req
 * @param {object} res
 */
const getOneItem = async (req, res) => {
  const { itemID, userID } = req.query;

  let payload = {
    data: null,
    message: '',
    error: null,
  };

  try {
    let data = {};

    if (userID) {
      // with data relative to specific user
      data = await db.runTransaction(async (transaction) => {
        const rawItem = await transaction.get(itemsCollection.doc(itemID));
        const rawLikes = await transaction.get(likesCollection.doc(itemID));

        const isLiked = Object.keys((rawLikes.exists && normalizeData(rawLikes)) || {})
          .includes(userID);

        return ({
          ...normalizeData(rawItem),
          key: rawItem.id,
          isLiked,
        });
      });
    } else {
      data = await itemsCollection.doc(itemID).get();
    }

    payload = {
      ...payload,
      message: 'Found it!',
      data,
    };

    res.status(200).send(payload);
  } catch (error) {
    payload = {
      ...payload,
      message: 'Ugh, Something went wrong. Blame that silly developer.',
      error: error.message,
    };

    res.status(400).send(payload);
  }
};

/**
 * updateItem.
 *
 * @param {object} req
 * @param {object} res
 */
const updateItem = async (req, res) => {
  const { body: data, query } = req;
  const { itemID } = query;
  let payload = {
    key: itemID,
    message: '',
    error: null,
  };

  // refs
  const itemRef = itemsCollection.doc(itemID);
  const tradeRequestRef = tradeRequestsCollection.doc(itemID);

  // updates
  try {
    const itemInEveryRequests = await requestsCollection.where('key', '==', itemID).get();

    await db.runTransaction(async (transaction) => {
      const tradeRequest = await tradeRequestRef.get();

      if (!itemInEveryRequests.empty) {
        itemInEveryRequests.forEach((requestItem) => {
          transaction.update(requestItem.ref, updatedItem(data));
        });
      }

      if (tradeRequest.exists) {
        transaction.update(tradeRequestRef, updatedItem(data));
      }

      transaction.update(itemRef, updatedItem(data));
    });

    payload = {
      ...payload,
      message: "You've updated your item, Nice one!",
    };

    res.status(200).send(payload);
  } catch (error) {
    payload = {
      ...payload,
      message: "Oops, Maybe the developer made a silly mistake. Otherwise, it's your fault.",
      error: error.message,
    };

    res.status(400).send(payload);
  }
};

/**
 * deleteItem.
 *
 * @param {object} req
 * @param {object} res
 */
const deleteItem = async (req, res) => {
  const { itemID } = req.query;
  let payload = {
    key: itemID,
    message: '',
    error: null,
  };

  const affectedRequestsParentKeys = [];

  // item related documents
  const itemRef = itemsCollection.doc(itemID);
  const itemInLikes = likesCollection.doc(itemID);
  const tradeRequestItem = tradeRequestsCollection.doc(itemID);
  const tradeRequestItemRequestsRef = tradeRequestItem.collection('requests');
  const tradeRequestItemRequestsStatsRef = tradeRequestItemRequestsRef.doc('--stats--');

  const tradeRequestItemRequests = await tradeRequestItemRequestsRef.get();

  // subcollections
  const itemInEveryRequests = await requestsCollection.where('key', '==', itemID).get();

  try {
    await db.runTransaction(async (transaction) => {
      const rawItem = await transaction.get(itemRef);
      const item = normalizeData(rawItem);

      transaction.delete(itemRef);

      transaction.delete(itemInLikes);

      transaction.delete(tradeRequestItem);

      if (item.isTrading || item.isTraded) {
        // update states
        transaction.update(itemsStats, incrementTotalItems(-1));

        // update all affected requests subcollection
        itemInEveryRequests.forEach((requestItem) => {
          transaction.delete(requestItem.ref);

          affectedRequestsParentKeys.push(requestItem.ref.parent.parent.id);
        });

        // for each affected parent decrement its current tradeRequests value
        affectedRequestsParentKeys.forEach((affectedItemKey) => {
          const requestItemStatsRef = tradeRequestsCollection
            .doc(affectedItemKey)
            .collection('requests')
            .doc('--stats--');

          transaction.update(requestItemStatsRef, incrementTotalRequests(-1));

          transaction.update(
            itemsCollection.doc(affectedItemKey),
            incrementTradeRequests(-1),
          );

          transaction.update(
            tradeRequestsCollection.doc(affectedItemKey),
            incrementTradeRequests(-1),
          );
        });

        // wipe out requests subcollection of the deleted item
        tradeRequestItemRequests.forEach((requestItem) => {
          transaction.delete(requestItem.ref);
          transaction.delete(tradeRequestItemRequestsStatsRef);
        });
      }
    });

    payload = {
      ...payload,
      message: "Your item is gone. It won't ever come back. Forever.",
    };

    res.status(200).send(payload);
  } catch (error) {
    payload = {
      ...payload,
      message: 'Oh no! There must be some issue/s here. Hmmm...',
      error: error.message,
    };

    res.status(400).send(payload);
  }
};

export default api({
  get: getOneItem,
  put: updateItem,
  delete: deleteItem,
});
