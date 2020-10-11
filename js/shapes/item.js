import firebaseApp from 'firebase/app';

/**
 * incrementTotalItems.
 *
 * @param {number} amount
 */
export const incrementTotalItems = (amount = 0) => ({
  totalItems: firebaseApp.firestore.FieldValue.increment(amount),
});

/**
 * newItem.
 *
 * @param {object} data
 */
export const newItem = (data = {}) => ({
  owner: data.userID,
  name: data.name,
  cover: data.cover,
  remarks: data.remarks,
  likes: 0,
  tradeRequests: 0,
  isTrading: false,
  isTraded: false,
  isDirty: false,
});

/**
 * updatedItem.
 *
 * @param {object} data
 */
export const updatedItem = (data = {}) => ({
  name: data.name,
  cover: data.cover,
  remarks: data.remarks,
});

export default {
  incrementTotalItems,
  newItem,
  updatedItem,
};
