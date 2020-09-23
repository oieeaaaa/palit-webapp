import firebase from 'palit-firebase';

const db = firebase.firestore();
const itemsRef = db.collection('items');
const likesRef = db.collection('likes');

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
  .limit(limit)
  .get();

/**
 * getWithLikes.
 *
 * It should retrieve items from other users
 * It should have an association with likesRef
 *
 * @param {string} userID
 * @param {number} limit
 */
const getWithLikes = async (userID, limit = 10) => {
  const rawItems = await get(userID, limit);

  return db.runTransaction(async (transaction) => {
    const itemsWithIsLiked = [];

    for (const rawItem of rawItems.docs) { // eslint-disable-line
      const rawLikes = await transaction.get(likesRef.doc(rawItem.id)); // eslint-disable-line

      itemsWithIsLiked.push({
        ...rawItem.data(),
        key: rawItem.id,
        isLiked: Object.keys(rawLikes.data()).includes(userID),
      });
    }

    return itemsWithIsLiked;
  });
};

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
 * getOne.
 *
 * @param {string} itemID
 */
const getOne = (itemID) => itemsRef.doc(itemID).get();

export default {
  add,
  get,
  getOne,
  getItemsAtUser,
  getWithLikes,
};
