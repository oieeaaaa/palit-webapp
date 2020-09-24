import firebase from 'palit-firebase';
import { normalizeData } from 'js/utils';

const db = firebase.firestore();
const itemsRef = db.collection('items');
const likesRef = db.collection('likes');
const tradeRequestsRef = db.collection('tradeRequests');

/**
 • 🚨🚨🚨🚨🚨🚨
   DANGER
 • 🚨🚨🚨🚨🚨🚨
 */
const reset = async () => {
  const batch = db.batch();
  const allItems = await itemsRef.get();

  allItems.forEach((itemRef) => {
    batch.update(itemsRef.doc(itemRef.id), {
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
  itemsRef.add({
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
 * get.
 *
 * It should retrieve items from other users
 * It should have a limit
 * @param {string} userID
 * @param {number} limit
 */
const get = (userID, limit = 10) => itemsRef
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
      const rawLikes = await transaction.get(likesRef.doc(rawItem.id)); // eslint-disable-line

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
const getOne = (itemID) => itemsRef.doc(itemID).get();

/**
 * getOneWithLikes.
 *
 * @param {string} itemID
 */
const getOneWithLikes = (itemID) => db.runTransaction(async (transaction) => {
  const rawItem = await transaction.get(itemsRef.doc(itemID));
  const rawLikes = await transaction.get(likesRef.doc(itemID));
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
const getItemsAtUser = (userID, limit = 10) => itemsRef
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
  const rawItems = await itemsRef
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
        tradeRequestsRef
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

export default {
  add,
  get,
  getOne,
  getOneWithLikes,
  getItemsAtUser,
  getWithIsLiked,
  getItemsToTrade,

  // WARNING DON'T USE THIS FUNCTION
  reset,
};
