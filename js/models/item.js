import firebase from 'palit-firebase';
import firebaseApp from 'firebase/app';

const db = firebase.firestore();

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
 * @param {string} userID
 * @param {object} data
 */
const add = (userID, data) => {
  const batch = db.batch();
  const newDocumentID = itemsCollection.doc().id;

  batch.set(itemsStats, {
    totalItems: firebaseApp.firestore.FieldValue.increment(1),
  }, { merge: true });

  batch.set(itemsCollection.doc(newDocumentID), {
    owner: userID,
    name: data.name,
    cover: data.cover,
    remarks: data.remarks,
    likes: 0,
    tradeRequests: 0,
    isTrading: false,
    isTraded: false,
    isDirty: false,
  }, { merge: true });

  batch.commit();
};

/**
 * update.
 *
 * @param {string} itemID
 * @param {object} data
 */
const update = async (itemID, data) => {
  const newItem = {
    name: data.name,
    cover: data.cover,
    remarks: data.remarks,
  };

  // refs
  const itemRef = itemsCollection.doc(itemID);
  const tradeRequestRef = tradeRequestsCollection.doc(itemID);

  // subcollections
  const itemInEveryRequests = await requestsCollection.where('key', '==', itemID).get();

  // updates
  return db.runTransaction(async (transaction) => {
    for (const itemDoc of itemInEveryRequests.docs) {
      transaction.update(itemDoc.ref, newItem);
    }

    transaction.update(itemRef, newItem);
    transaction.update(tradeRequestRef, newItem);
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
 * getWithIsLiked.
 *
 * It should retrieve items from other users
 * It should have an association with likesRef
 *
 * @param {string} userID
 * @param {number} limit
 */
const getWithIsLiked = async (userID, limit) => {
  const rawItems = await get(userID, limit);

  return db.runTransaction(async (transaction) => {
    const itemsWithIsLiked = [];

    for (const rawItem of rawItems.docs) {
      const rawLikes = await transaction.get(likesCollection.doc(rawItem.id));

      itemsWithIsLiked.push({
        ...rawItem.data(),
        key: rawItem.id,

        // with this
        isLiked: rawLikes.exists ? Object.keys(rawLikes.data()).includes(userID) : false,
      });
    }

    return itemsWithIsLiked;
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
 */
const getItemsToTrade = (userID) => itemsCollection
  .where('owner', '==', userID)
  .where('isTraded', '==', false)
  .get();

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
  const tradeRequestItemRequests = await tradeRequestItem.collection('requests').get();

  // subcollections
  const itemInEveryRequests = await requestsCollection.where('key', '==', itemID).get();

  // removal processes
  return db.runTransaction(async (transaction) => {
    const item = await transaction.get(itemRef);

    /* =======================================================================
      ONLY FOR TRADING ITEMS
    ======================================================================= */
    if (item.isTrading || item.isTraded) {
      // update states
      transaction.update(
        itemsStats,
        { totalItems: firebaseApp.firestore.FieldValue.increment(-1) },
      );

      // update all affected requests subcollection
      itemInEveryRequests.forEach((requestItem) => {
        const requestItemStatsRef = requestItem.doc('--stats--');

        transaction.delete(requestItem.ref);
        transaction.update(requestItemStatsRef, {
          totalRequests: firebaseApp.firestore.FieldValue.increment(-1),
        });

        affectedRequestsParentKeys.push(requestItem.ref.parent.parent.id);
      });

      // for each affected parent decrement its current tradeRequests value
      affectedRequestsParentKeys.forEach((affectedItemKey) => {
        transaction.update(itemsCollection.doc(affectedItemKey), {
          tradeRequests: firebaseApp.firestore.FieldValue.increment(-1),
        });

        transaction.update(tradeRequestsCollection.doc(affectedItemKey), {
          tradeRequests: firebaseApp.firestore.FieldValue.increment(-1),
        });
      });

      // wipe out requests subcollection of the deleted item
      tradeRequestItemRequests.forEach((requestItem) => {
        const requestItemStatsRef = requestItem.doc('--stats--');
        transaction.delete(requestItem.ref);
        transaction.delete(requestItemStatsRef);
      });
    }

    // other deletes
    transaction.delete(itemRef);
    transaction.delete(itemInLikes);
    transaction.delete(tradeRequestItem);
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

/**
 • 🚨🚨🚨🚨🚨🚨
   DANGER
   DO NOT INCLUDE THIS IN PROD!
 • 🚨🚨🚨🚨🚨🚨
 */
const reset = async () => {
  const batch = db.batch();
  const allItems = await itemsCollection.get();
  const allTradeRequests = await tradeRequestsCollection.get();
  const allLikes = await likesCollection.get();

  allItems.forEach((itemRef) => {
    batch.update(itemsCollection.doc(itemRef.id), {
      likes: 0,
      tradeRequests: 0,
      isTraded: false,
    });
  });

  allTradeRequests.forEach((tradeRequest) => {
    batch.delete(tradeRequest.ref);
  });

  allLikes.forEach((like) => {
    batch.delete(like.ref);
  });

  batch.commit();
};

export default {
  getItemsStats,
  add,
  update,
  get,
  getOne,
  getOneWithLikes,
  getItemsAtUser,
  getWithIsLiked,
  getItemsToTrade,
  remove,
  search,
  cleanDirty,

  // WARNING DON'T USE THIS FUNCTION
  reset,
};
