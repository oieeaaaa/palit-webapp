import firebase from 'palit-firebase';
import firebaseApp from 'firebase/app';
import { normalizeData } from 'js/utils';

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
 * TODO: Prevent two-way trade (only one user should be able to perform the trade)
 *
 * @param {object} myItem
 * @param {object} itemToTrade
 */
const add = async (myItem, itemToTrade) => {
  const myRequests = await requestsCollectionGroup.where('key', '==', myItem.key).get();
  const otherRequests = await requestsCollectionGroup.where('key', '==', itemToTrade.key).get();
  const requests = [].concat(myRequests.docs, otherRequests.docs);

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

    transaction.update(itemsCollection.doc(myItem.key), {
      tradeRequests: firebaseApp.firestore.FieldValue.increment(1),
    });

    transaction.update(itemsCollection.doc(itemToTrade.key), {
      tradeRequests: firebaseApp.firestore.FieldValue.increment(1),
      isDirty: true,
    });

    /* ========================================================================
      tradeRequests
    ======================================================================== */

    transaction.set(myTradeRequestRef, {
      key: myItem.key,
      name: myItem.name,
      owner: myItem.owner,
      tradeRequests: myItem.tradeRequests + 1,
      likes: myItem.tradeRequests,
      isTraded: myItem.isTraded,
      isAccepted: false,
    });

    transaction.set(otherTradeRequestRef, {
      key: itemToTrade.key,
      owner: itemToTrade.owner,
      isTraded: itemToTrade.isTraded,
      name: itemToTrade.name,
      tradeRequests: itemToTrade.tradeRequests + 1,
      isAccepted: false,
    });

    /* ========================================================================
      tradeRequests > requests
    ======================================================================== */

    transaction.set(myRequestsStatsRef, {
      totalRequests: firebaseApp.firestore.FieldValue.increment(1),
    }, { merge: true });

    transaction.set(otherRequestsStatsRef, {
      totalRequests: firebaseApp.firestore.FieldValue.increment(1),
    }, { merge: true });

    transaction.set(myNewRequestsItemRef, {
      ...itemToTrade,
      tradeRequests: itemToTrade.tradeRequests + 1,
    });

    transaction.set(otherNewRequestsItemRef, {
      ...myItem,
      tradeRequests: myItem.tradeRequests + 1,

      // This means that if the current user performs the request to
      // another user's item this will be set to true
      // Otherwise, Other user performs the request
      // to the current user's item (which will be false or undefined)
      isRequestor: true,
    });

    requests.forEach((request) => {
      transaction.update(request.ref, {
        tradeRequests: firebaseApp.firestore.FieldValue.increment(1),
      });
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
    transaction.set(myItemRef, {
      tradeRequests: firebaseApp.firestore.FieldValue.increment(-1),
    }, { merge: true });

    transaction.set(otherItemRef, {
      tradeRequests: firebaseApp.firestore.FieldValue.increment(-1),
    }, { merge: true });

    /* ========================================================================
      tradeRequests
    ======================================================================== */
    transaction.update(myTradeRequestRef, {
      totalRequests: firebaseApp.firestore.FieldValue.increment(-1),
    });

    transaction.update(otherTradeRequestRef, {
      totalRequests: firebaseApp.firestore.FieldValue.increment(-1),
    });

    /* ========================================================================
      tradeRequests > requests
    ======================================================================== */
    transaction.delete(myRequestsItemRef);
    transaction.delete(otherRequestsItemRef);

    transaction.update(myRequestsStatsRef, {
      totalRequests: firebaseApp.firestore.FieldValue.increment(-1),
    });

    transaction.update(otherRequestsStatsRef, {
      totalRequests: firebaseApp.firestore.FieldValue.increment(-1),
    });

    requests.forEach((affectedItem) => {
      transaction.update(affectedItem.ref, {
        tradeRequests: firebaseApp.firestore.FieldValue.increment(-1),
      });
    });
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

    transaction.update(myItemRef, {
      isTraded: true,
      isTrading: false,
    });

    transaction.update(itemToAcceptRef, {
      isTraded: true,
      isDirty: true,
      isTrading: false,
    });

    /* ========================================================================
      tradeRequests
    ======================================================================== */

    transaction.update(myTradeRequestsRef, {
      isAccepted: true,
      isTraded: true,
      acceptedItem: {
        key: itemToAccept.key,
        owner: itemToAccept.owner,
      },
    });

    transaction.update(itemToAcceptTradeRequestsRef, {
      isAccepted: true,
      isTraded: true,
      isDirty: true,
      acceptedItem: {
        key: myItem.key,
        owner: myItem.owner,
      },
    });

    /* ========================================================================
      tradeRequests > requests
    ======================================================================== */

    requests.forEach((requestItem) => {
      transaction.update(
        requestItem.ref,
        {
          isTraded: true,
          isTrading: false,
        },
      );
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
