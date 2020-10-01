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
    isTraded: false,
  }, { merge: true });

  batch.commit();
};

/**
 * update.
 *
 * @param {string} itemID
 * @param {object} data
 */
const update = (itemID, data) => (
  itemsCollection.doc(itemID).update({
    name: data.name,
    cover: data.cover,
    remarks: data.remarks,
  })
);

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

    for (const rawItem of rawItems.docs) { // eslint-disable-line
      const rawLikes = await transaction.get(likesCollection.doc(rawItem.id)); // eslint-disable-line

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
 * @param {string} itemID
 */
const getOneWithLikes = (itemID) => db.runTransaction(async (transaction) => {
  const rawItem = await transaction.get(itemsCollection.doc(itemID));
  const rawLikes = await transaction.get(likesCollection.doc(itemID));
  const isLiked = Object.keys(rawLikes).includes(itemID);

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
 * Query items that are available for trade
 * TODO: Validate if the user already traded the item to the current item
 *
 * @param {string} userID
 * @param {number} limit
 */
const getItemsToTrade = (userID, limit = 10) => itemsCollection
  .where('owner', '==', userID)
  .where('isTraded', '==', false)
  .limit(limit)
  .get();

/**
 * remove
 *
 * @param {string} itemID
 */
const remove = async (itemID) => {
  const batch = db.batch();
  const item = itemsCollection.doc(itemID);
  const itemInLikes = likesCollection.doc(itemID);
  const itemInTradeRequest = tradeRequestsCollection.doc(itemID);
  const itemInEveryRequests = await requestsCollection.where('key', '==', itemID).get();

  batch.update(itemsStats, { totalItems: firebaseApp.firestore.FieldValue.increment(-1) });
  batch.delete(item);
  batch.delete(itemInLikes);
  batch.delete(itemInTradeRequest);

  // remove item in every requests
  itemInEveryRequests.forEach((itemDoc) => {
    batch.delete(itemDoc.ref);
  });

  return batch.commit();
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
 • 🚨🚨🚨🚨🚨🚨
   DANGER
 • 🚨🚨🚨🚨🚨🚨
 */
const reset = async () => {
  const batch = db.batch();
  const allItems = await itemsCollection.get();

  allItems.forEach((itemRef) => {
    batch.update(itemsCollection.doc(itemRef.id), {
      likes: 0,
      tradeRequests: 0,
      isTraded: false,
    });
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

  // WARNING DON'T USE THIS FUNCTION
  reset,
};
