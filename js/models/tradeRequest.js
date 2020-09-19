import firebase from 'palit-firebase';

const tradeRequestsRef = firebase.database().ref('tradeRequests');

/**
 * tradeRequests.
 *
 * @param {string} userID
 * @param {string} itemID
 * @param {object} data
 */
const add = (userID, itemID, data) => (
  // e.g., /john/cup
  tradeRequestsRef.child(userID).child(itemID)
    .push({
      [data.key]: {
        cover: data.cover,
        title: data.title,
        likes: data.likes,
        tradeRequests: data.tradeRequests,
      },
    })
);

export default {
  add,
};
