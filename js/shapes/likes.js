import firebaseApp from 'firebase/app';

/**
 * incrementLikes.
 *
 * @param {number} amount
 */
export const incrementLikes = (amount = 0) => ({
  likes: firebaseApp.firestore.FieldValue.increment(amount),
});

/**
 * newUser.
 *
 * @param {string} userID
 */
export const newUser = (userID) => ({
  [userID]: true,
});

/**
 * removeUser.
 *
 * @param {string} userID
 */
export const removeUser = (userID) => ({
  [userID]: firebaseApp.firestore.FieldValue.delete(),
});

export default {
  incrementLikes,
  newUser,
  removeUser,
};
