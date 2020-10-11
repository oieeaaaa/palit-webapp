import firebase from 'palit-firebase';
import { normalizeData } from 'js/utils';
import {
  newTradeRequest,
  newRequest,
  incrementTradeRequests,
  incrementTotalRequests,
  acceptedItemStatus,
  acceptedTradeRequest,
} from 'js/shapes/tradeRequest';

const db = firebase.firestore();

// collections
const tradeRequestsCollection = db.collection('tradeRequests');
const itemsCollection = db.collection('items');

// subcollections
const requestsCollectionGroup = db.collectionGroup('requests');

/**
 * getRequestsStats.
 *
 * @param {string} itemID
 */
const getRequestsStats = (itemID) => tradeRequestsCollection
  .doc(itemID)
  .collection('requests')
  .doc('--stats--').get();

/**
 * add.
 *
 * So many locations to update 😱
 * It's okay (maybe)
 *
 * @param {object} myItem
 * @param {object} itemToTrade
 */
const add = async (myItem, itemToTrade) => {
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

  return db.runTransaction(async (transaction) => {
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
};

/**
 * cancel.
 *
 * Remove the myItemID from itemToTradeID requests collection 🔥
 * Reduce the count of tradeRequests in every documents affected
 *
 * @param {string} myItemID
 * @param {string} itemToTradeID
 */
const cancel = async (myItemID, itemToTradeID) => {
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

  return db.runTransaction(async (transaction) => {
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
};

/**
 * getOne
 *
 * @type {string} itemID
 */
const getOne = async (itemID, limit = 10) => {
  const tradeRequestItemRef = tradeRequestsCollection.doc(itemID);
  const requests = await tradeRequestItemRef.collection('requests').limit(limit || 10).get();

  return db.runTransaction(async (transaction) => {
    const rawTradeRequestItem = await transaction.get(tradeRequestItemRef);

    if (!rawTradeRequestItem) return null;

    // kudos to doug for providing this snippet below 🎉
    const requestsInTransaction = [];

    for (const doc of requests.docs) {
      if (doc.id !== '--stats--') {
        const requestInTransaction = await transaction.get(doc.ref);
        requestsInTransaction.push(normalizeData(requestInTransaction));
      }
    }
    // https://stackoverflow.com/questions/63995150/how-to-query-subcollection-inside-transaction-in-firebase/63995746#63995746

    return {
      ...normalizeData(rawTradeRequestItem),
      requests: requestsInTransaction,
    };
  });
};

/**
 * accept.
 *
 * @param {object} myItem
 * @param {object} itemToAccept
 */
const accept = async (myItem, itemToAccept) => {
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

  return db.runTransaction(async (transaction) => {
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
};

export default {
  getRequestsStats,
  add,
  cancel,
  getOne,
  accept,
};
