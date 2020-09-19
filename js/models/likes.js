import firebase from 'palit-firebase';

const likesRef = firebase.database().ref('likes');

/**
 * add.
 *
 * @param {string} userID
 * @param {string} itemID
 */
const add = (userID, itemID) => (
  // e.g., /likes/cup
  likesRef.child(itemID).push({
    [userID]: true,
  })
);

export default {
  add,
};
