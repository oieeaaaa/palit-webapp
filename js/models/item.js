import firebase from 'palit-firebase';
import { normalizeData } from 'js/utils';
import {
  incrementTotalItems,
  newItem,
  updatedItem,
} from 'js/shapes/item';
import {
  incrementTotalRequests,
  incrementTradeRequests,
} from 'js/shapes/tradeRequest';

const db = firebase.firestore();

// collections, docs
const itemsCollection = db.collection('items');
const itemsStats = db.collection('items').doc('--stats--');
const likesCollection = db.collection('likes');
const tradeRequestsCollection = db.collection('tradeRequests');
const requestsCollection = db.collectionGroup('requests');

/**
 * getItemsStats
 */
const getItemsStats = () => itemsStats.get();

/**
 * add.
 *
 * @param {object} owner
 * @param {object} data
 */
const add = (owner, data) => {
  const batch = db.batch();
  const newDocumentID = itemsCollection.doc().id;

  batch.set(itemsStats, incrementTotalItems(1), { merge: true });

  batch.set(itemsCollection.doc(newDocumentID), newItem(owner, data), { merge: true });

  batch.commit();
};

/**
 * update.
 *
 * @param {string} itemID
 * @param {object} data
 */
const update = async (itemID, data) => {
  // refs
  const itemRef = itemsCollection.doc(itemID);
  const tradeRequestRef = tradeRequestsCollection.doc(itemID);

  // subcollections
  const itemInEveryRequests = await requestsCollection.where('key', '==', itemID).get();

  // updates
  return db.runTransaction(async (transaction) => {
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
};

/**
 * get.
 *
 * It should retrieve items from other users
 * It should have a limit
 * @param {string} userID
 * @param {number} limit
 */
const get = (userID, limit = 10) => itemsCollection
  .where('owner', '!=', userID)
  .where('isTraded', '==', false)
  .limit(limit || 10)
  .get();

/**
 * getOthersItems.
 *
 * It should retrieve items from other users
 * It should have an association with likesRef
 *
 * @param {string} userID
 * @param {number} limit
 */
const getOthersItems = async (userID, limit) => {
  const rawItems = await get(userID, limit);

  return db.runTransaction(async (transaction) => {
    const newItems = [];

    for (const rawItem of rawItems.docs) {
      const rawRequests = await tradeRequestsCollection.doc(rawItem.id).collection('requests').get();
      const rawLikes = await transaction.get(likesCollection.doc(rawItem.id));
      const isTradingPartner = !rawRequests.empty && rawRequests.docs.some(
        (rawRequest) => normalizeData(rawRequest).owner === userID,
      );

      newItems.push({
        ...rawItem.data(),
        key: rawItem.id,

        // with this
        isLiked: rawLikes.exists ? Object.keys(rawLikes.data()).includes(userID) : false,
        isTradingPartner,
      });
    }

    return newItems;
  });
};

/**
 * getOne.
 *
 * @param {string} itemID
 */
const getOne = (itemID) => itemsCollection.doc(itemID).get();

/**
 * getOneWithLikes.
 *
 * @param {string} userID
 * @param {string} itemID
 */
const getOneWithLikes = (userID, itemID) => db.runTransaction(async (transaction) => {
  const rawItem = await transaction.get(itemsCollection.doc(itemID));
  const rawLikes = await transaction.get(likesCollection.doc(itemID));

  const isLiked = Object.keys((rawLikes.exists && rawLikes.data()) || {}).includes(userID);

  return ({
    ...rawItem.data(),
    key: rawItem.id,
    isLiked,
  });
});

/**
 * getItemsAtUser.
 *
 * @param {string} userID
 * @param {number} limit
 */
const getItemsAtUser = (userID, limit = 10) => itemsCollection
  .where('owner', '==', userID)
  .limit(limit || 10)
  .get();

/**
 * getItemsToTrade.
 *
 * Query items of user that are available for trade
 *
 * @param {string} userID
 * @param {string} itemToTradeID
 */
const getItemsToTrade = async (userID, itemToTradeID) => {
  const rawItems = await itemsCollection.where('owner', '==', userID).where('isTraded', '==', false).get();
  const newItems = [];

  for (const rawItem of rawItems.docs) {
    let isItemAlreadyTraded = false;
    const rawRequests = await tradeRequestsCollection.doc(itemToTradeID).collection('requests').get();

    if (!rawRequests.empty) {
      for (const rawRequest of rawRequests.docs) {
        if (rawRequest.id === rawItem.id) {
          isItemAlreadyTraded = true;
        }
      }
    }

    if (!isItemAlreadyTraded) {
      newItems.push(normalizeData(rawItem));
    }
  }

  return newItems;
};

/**
 * remove
 *
 * @param {string} itemID
 */
const remove = async (itemID) => {
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

  // removal processes
  return db.runTransaction(async (transaction) => {
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
};

/**
 * search.
 *
 * NOTE: This is just a sample
 * TODO: Use algolia or find a way to make full-text search work
 *
 * @param {string} query
 */
const search = async (query) => itemsCollection.where('name', '==', query).get();

/**
 * cleanDirty
 *
 * @param {string} itemID
 */
const cleanDirty = (itemID) => itemsCollection.doc(itemID).update({
  isDirty: false,
});

export default {
  getItemsStats,
  add,
  update,
  get,
  getOne,
  getOneWithLikes,
  getItemsAtUser,
  getOthersItems,
  getItemsToTrade,
  remove,
  search,
  cleanDirty,
};
