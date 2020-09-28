import firebase from 'palit-firebase';
import { normalizeData } from 'js/utils';

const db = firebase.firestore();
const itemsCollection = db.collection('items');
const likesCollection = db.collection('likes');
const tradeRequestsCollection = db.collection('tradeRequests');
const requestsCollection = db.collectionGroup('requests');

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

/**
 * add.
 *
 * @param {string} userID
 * @param {object} data
 */
const add = (userID, data) => (
  itemsCollection.add({
    owner: userID,
    name: data.name,
    cover: data.cover,
    remarks: data.remarks,
    likes: 0,
    tradeRequests: 0,
    isTraded: false,
  })
);

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
  .limit(limit)
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
const getWithIsLiked = async (userID, limit = 10) => {
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
  .limit(limit)
  .get();

/**
 * getItemsToTrade.
 *
 * Query items that are available for trade
 * TODO: Validate if the user already traded the item to the current item
 *
 * @param {string} userID
 * @param {string} itemID (Selected itemID to trade)
 * @param {number} limit
 */
const getItemsToTrade = async (userID, itemID, limit = 10) => {
  const rawItems = await itemsCollection
    .where('owner', '==', userID)
    .where('isTraded', '==', false)
    .limit(limit)
    .get();

  // Can be improved
  // With proper db architecture
  // Or using collection group queries
  // TODO: Please improve this code and don't be lazy.
  return db.runTransaction(async (transaction) => {
    const itemsToTrade = [];

    // Filter all the requested items to the itemID
    for (const rawItem of rawItems.docs) { // eslint-disable-line
      const itemInTradeRequest = await transaction.get( // eslint-disable-line
        tradeRequestsCollection
          .doc(rawItem.id)
          .collection('requests').doc(itemID),
      );

      if (!itemInTradeRequest.exists) {
        itemsToTrade.push(normalizeData(rawItem));
      }
    }

    return itemsToTrade;
  });
};

const remove = async (itemID) => {
  const batch = db.batch();
  const item = itemsCollection.doc(itemID);
  const itemInLikes = likesCollection.doc(itemID);
  const itemInTradeRequest = tradeRequestsCollection.doc(itemID);
  const itemInEveryRequests = await requestsCollection.where('key', '==', itemID).get();

  batch.delete(item);
  batch.delete(itemInLikes);
  batch.delete(itemInTradeRequest);

  // remove item in every requests
  itemInEveryRequests.forEach((itemDoc) => {
    batch.delete(itemDoc.ref);
  });

  return batch.commit();
};

export default {
  update,
  add,
  get,
  getOne,
  getOneWithLikes,
  getItemsAtUser,
  getWithIsLiked,
  getItemsToTrade,
  remove,

  // WARNING DON'T USE THIS FUNCTION
  reset,
};
