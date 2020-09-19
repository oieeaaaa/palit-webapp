import firebase from 'palit-firebase';

const itemsRef = firebase.database().ref('items');

/**
 * add.
 *
 * @param {string} userID
 * @param {object} data
 */
const add = (userID, data) => (
  itemsRef.push({
    owner: userID,
    title: data.title,
    cover: data.cover,
    remarks: data.remarks,
    likes: data.likes || 0,
    tradeRequests: data.tradeRequests || 0,
    isTraded: false,
  })
);

export default {
  add,
};
