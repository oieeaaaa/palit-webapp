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
 * The hard part and the most important one
 *
 * @param {object} myItem
 * @param {object} itemToTrade
 */
const add = async (myItem, itemToTrade) => {
  const batch = db.batch();

  // My Item Refs
  const myItemRef = tradeRequestsCollection.doc(myItem.key);
  const myItemRequestsItemRef = myItemRef.collection('requests').doc(itemToTrade.key);
  const myItemRequestsStatsRef = myItemRef.collection('requests').doc('--stats--');

  // Item to trade Refs
  const itemToTradeRef = tradeRequestsCollection.doc(itemToTrade.key);
  const itemToTradeRequestsItemRef = itemToTradeRef.collection('requests').doc(myItem.key);
  const itemToTradeRequestsStatsRef = itemToTradeRef.collection('requests').doc('--stats--');

  // My item
  batch.update(itemsCollection.doc(myItem.key), {
    tradeRequests: firebaseApp.firestore.FieldValue.increment(1),
  });

  batch.set(myItemRef, {
    key: myItem.key,
    owner: myItem.owner,
    isTraded: myItem.isTraded,
    name: myItem.name,
    tradeRequests: myItem.tradeRequests + 1,
    isAccepted: false,
  });

  batch.set(myItemRequestsStatsRef, {
    totalRequests: firebaseApp.firestore.FieldValue.increment(1),
  }, { merge: true });
  batch.set(myItemRequestsItemRef, itemToTrade);

  // Item to Trade
  batch.update(itemsCollection.doc(itemToTrade.key), {
    tradeRequests: firebaseApp.firestore.FieldValue.increment(1),
    isDirty: true,
  });

  batch.set(itemToTradeRef, {
    key: itemToTrade.key,
    owner: itemToTrade.owner,
    isTraded: itemToTrade.isTraded,
    name: itemToTrade.name,
    tradeRequests: itemToTrade.tradeRequests + 1,
    isAccepted: false,
  });

  batch.set(itemToTradeRequestsStatsRef, {
    totalRequests: firebaseApp.firestore.FieldValue.increment(1),
  }, { merge: true });
  batch.set(itemToTradeRequestsItemRef, {
    ...myItem,

    // This means that if the current user performs the request to
    // another user's item this will be set to true
    // Otherwise, Other user performs the request
    // to the current user's item (which will be false or undefined)
    isRequestor: true,
  });

  // Done
  batch.commit();
};

/**
 * remove.
 *
 * Remove the myItemID from itemToTradeID requests collection 🔥
 * Reduce the count of tradeRequests in every documents affected
 *
 * @param {string} myItemID
 * @param {string} itemToTradeID
 */
const remove = async (myItemID, itemToTradeID) => {
  const batch = db.batch();

  // My Item Refs
  const myItemRef = tradeRequestsCollection.doc(myItemID);
  const myItemRequestsItemRef = myItemRef.collection('requests').doc(itemToTradeID);
  const myItemInEveryRequests = await requestsCollectionGroup.where('key', '==', myItemID).get();

  // Item to trade Refs
  const itemToTradeRef = tradeRequestsCollection.doc(itemToTradeID);
  const itemToTradeRequestsItemRef = itemToTradeRef.collection('requests').doc(myItemID);
  const itemToTradeInEveryRequests = await requestsCollectionGroup.where('key', '==', itemToTradeID).get();

  // bulk requests updates
  const allAffectedItemInRequests = [
    ...myItemInEveryRequests.docs,
    ...itemToTradeInEveryRequests.docs,
  ];

  allAffectedItemInRequests.forEach((affectedItem) => {
    batch.update(affectedItem.ref, {
      tradeRequests: firebaseApp.firestore.FieldValue.increment(-1),
    });
  });

  // My Item Updates
  batch.delete(myItemRequestsItemRef);
  batch.set(itemsCollection.doc(myItemID), {
    tradeRequests: firebaseApp.firestore.FieldValue.increment(-1),
  }, { merge: true });

  // Item to trade updates
  batch.delete(itemToTradeRequestsItemRef);
  batch.set(itemsCollection.doc(itemToTradeID), {
    tradeRequests: firebaseApp.firestore.FieldValue.increment(-1),
  }, { merge: true });

  return batch.commit();
};

/**
 * getOne
 *
 * Woah.
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

    for (const doc of requests.docs) { // eslint-disable-line
      if (doc.id !== '--stats--') {
        const requestInTransaction = await transaction.get(doc.ref); // eslint-disable-line
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
 * acceptRequest.
 *
 * @param {object} myItem
 * @param {object} itemToAccept
 */
const acceptRequest = async (myItem, itemToAccept) => {
  const batch = db.batch();

  const myItemRef = tradeRequestsCollection.doc(myItem.key);
  const itemToAcceptRef = tradeRequestsCollection.doc(itemToAccept.key);

  const myItemRequests = await requestsCollectionGroup.where('key', '==', myItem.key).get();
  const itemToAcceptRequests = await requestsCollectionGroup.where('key', '==', itemToAccept.key).get();
  const allRequests = [].concat(myItemRequests.docs, itemToAcceptRequests.docs);

  batch.update(myItemRef, {
    isAccepted: true,
    isTraded: true,
    acceptedItem: itemToAccept,
  });

  batch.update(itemToAcceptRef, {
    isAccepted: true,
    isTraded: true,
    isDirty: true,
    acceptedItem: myItem,
  });

  batch.update(itemsCollection.doc(myItem.key), { isTraded: true });
  batch.update(itemsCollection.doc(itemToAccept.key), { isTraded: true, isDirty: true });

  allRequests.forEach((requestItem) => {
    batch.update(
      requestItem.ref,
      { isTraded: true },
    );
  });

  return batch.commit();
};

export default {
  getRequestsStats,
  add,
  remove,
  getOne,
  acceptRequest,
};
