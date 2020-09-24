import firebase from 'palit-firebase';
import firebaseApp from 'firebase/app';
import { normalizeData } from 'js/utils';

const db = firebase.firestore();

// collections
const tradeRequestsCollection = db.collection('tradeRequests');
const itemsCollection = db.collection('items');

// subcollections
const requestsCollection = db.collectionGroup('requests');

/**
 * add.
 *
 * So many locations to update 😱
 * The hard part and the most important one
 *
 * @param {object} myItem
 * @param {object} itemToTrade
 */
const add = (myItem, itemToTrade) => {
  const batch = db.batch();

  // My Item Refs
  const myItemRef = tradeRequestsCollection.doc(myItem.key);
  const myItemRequestsItemRef = myItemRef.collection('requests').doc(itemToTrade.key);

  // Item to trade Refs
  const itemToTradeRef = tradeRequestsCollection.doc(itemToTrade.key);
  const itemToTradeRequestsItemRef = itemToTradeRef.collection('requests').doc(myItem.key);

  // Update 'My Item' tradeRequests count
  batch.update(itemsCollection.doc(myItem.key), {
    tradeRequests: firebaseApp.firestore.FieldValue.increment(1),
  });

  // Update 'Item to Trade' tradeRequests count
  batch.update(itemsCollection.doc(itemToTrade.key), {
    tradeRequests: firebaseApp.firestore.FieldValue.increment(1),
  });

  // Update 'My Item' tradeRequests
  batch.set(myItemRef, {
    ...myItem,
    tradeRequests: myItem.tradeRequests + 1,
    isAccepted: false,
  });
  batch.set(myItemRequestsItemRef, itemToTrade);

  // Update 'Item to Trade' tradeRequests
  batch.set(itemToTradeRef, {
    ...itemToTrade,
    tradeRequests: itemToTrade.tradeRequests + 1,
    isAccepted: false,
  });
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
 * Reduced the count of tradeRequests in every documents affected
 *
 * @param {string} myItemID
 * @param {string} itemToTradeID
 */
const remove = (myItemID, itemToTradeID) => {
  const batch = db.batch();

  // My Item Refs
  const myItemRef = tradeRequestsCollection.doc(myItemID);
  const myItemRequestsItemRef = myItemRef.collection('requests').doc(itemToTradeID);

  // Item to trade Refs
  const itemToTradeRef = tradeRequestsCollection.doc(itemToTradeID);
  const itemToTradeRequestsItemRef = itemToTradeRef.collection('requests').doc(myItemID);

  // My Item Updates
  batch.delete(myItemRequestsItemRef);
  batch.update(itemsCollection.doc(myItemID), {
    tradeRequests: firebaseApp.firestore.FieldValue.increment(-1),
  });

  // Item to trade updates
  batch.delete(itemToTradeRequestsItemRef);
  batch.update(itemsCollection.doc(itemToTradeID), {
    tradeRequests: firebaseApp.firestore.FieldValue.increment(-1),
  });

  return batch.commit();
};

/**
 * getOne
 *
 * Woah.
 *
 * @type {string} itemID
 */
const getOne = async (itemID) => {
  const tradeRequestItemRef = tradeRequestsCollection.doc(itemID);
  const requests = await tradeRequestItemRef.collection('requests').get();

  return db.runTransaction(async (transaction) => {
    const rawTradeRequestItem = await transaction.get(tradeRequestItemRef);

    if (!rawTradeRequestItem) return null;

    // kudos to doug for providing this snippet below 🎉
    const requestsInTransaction = [];

    for (const doc of requests.docs) { // eslint-disable-line
      const requestInTransaction = await transaction.get(doc.ref); // eslint-disable-line
      requestsInTransaction.push(normalizeData(requestInTransaction));
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

  const myItemRequests = await requestsCollection.where('key', '==', myItem.key).get();
  const itemToAcceptRequests = await requestsCollection.where('key', '==', itemToAccept.key).get();
  const allRequests = [].concat(myItemRequests.docs, itemToAcceptRequests.docs);

  batch.update(myItemRef, {
    isAccepted: true,
    isTraded: true,
    acceptedItem: itemToAccept,
  });

  batch.update(itemToAcceptRef, {
    isAccepted: true,
    isTraded: true,
    acceptedItem: myItem,
  });

  batch.update(itemsCollection.doc(myItem.key), { isTraded: true });
  batch.update(itemsCollection.doc(itemToAccept.key), { isTraded: true });

  allRequests.forEach((requestItem) => {
    batch.update(
      requestItem.ref,
      { isTraded: true },
    );
  });

  return batch.commit();
};

export default {
  add,
  remove,
  getOne,
  acceptRequest,
};
