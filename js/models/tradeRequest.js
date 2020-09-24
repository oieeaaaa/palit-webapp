import firebase from 'palit-firebase';
import firebaseApp from 'firebase/app';
import { normalizeData } from 'js/utils';

const db = firebase.firestore();
const tradeRequestsRef = db.collection('tradeRequests');
const itemRef = db.collection('items');

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
  const myItemRef = tradeRequestsRef.doc(myItem.key);
  const myItemRequestsItemRef = myItemRef.collection('requests').doc(itemToTrade.key);

  // Item to trade Refs
  const itemToTradeRef = tradeRequestsRef.doc(itemToTrade.key);
  const itemToTradeRequestsItemRef = itemToTradeRef.collection('requests').doc(myItem.key);

  // Update 'My Item' tradeRequests count
  batch.update(itemRef.doc(myItem.key), {
    tradeRequests: firebaseApp.firestore.FieldValue.increment(1),
  });

  // Update 'Item to Trade' tradeRequests count
  batch.update(itemRef.doc(itemToTrade.key), {
    tradeRequests: firebaseApp.firestore.FieldValue.increment(1),
  });

  // Update 'My Item' tradeRequests
  batch.set(myItemRef, {
    ...myItem,
    tradeRequests: myItem.tradeRequests + 1,
    isAccepted: false,
  });
  batch.set(myItemRequestsItemRef, {
    cover: itemToTrade.cover,
    name: itemToTrade.name,
    isTraded: itemToTrade.isTraded,
    likes: itemToTrade.likes,
    tradeRequests: itemToTrade.tradeRequests + 1,
    owner: itemToTrade.owner,
  });

  // Update 'Item to Trade' tradeRequests
  batch.set(itemToTradeRef, {
    ...itemToTrade,
    tradeRequests: itemToTrade.tradeRequests + 1,
    isAccepted: false,
  });
  batch.set(itemToTradeRequestsItemRef, {
    cover: myItem.cover,
    name: myItem.name,
    isTraded: myItem.isTraded,
    likes: myItem.likes,
    tradeRequests: myItem.tradeRequests + 1,
    owner: myItem.owner,

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
  const myItemRef = tradeRequestsRef.doc(myItemID);
  const myItemRequestsItemRef = myItemRef.collection('requests').doc(itemToTradeID);

  // Item to trade Refs
  const itemToTradeRef = tradeRequestsRef.doc(itemToTradeID);
  const itemToTradeRequestsItemRef = itemToTradeRef.collection('requests').doc(myItemID);

  // My Item Updates
  batch.delete(myItemRequestsItemRef);
  batch.update(itemRef.doc(myItemID), {
    tradeRequests: firebaseApp.firestore.FieldValue.increment(-1),
  });

  // Item to trade updates
  batch.delete(itemToTradeRequestsItemRef);
  batch.update(itemRef.doc(itemToTradeID), {
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
  const tradeRequestItemRef = tradeRequestsRef.doc(itemID);
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

export default {
  add,
  remove,
  getOne,
};
