import firebase from 'palit-firebase';

const db = firebase.firestore();
const itemsRef = db.collection('items');

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
 * TODO: It should retrieve items from other users
 * It should have a limit
 * @param {string} userID
 * @param {number} limit
 */
const get = async (userID, limit = 10) => itemsRef
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
};
