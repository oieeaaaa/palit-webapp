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
 * @param {object} owner
 * @param {object} data
 */
export const newItem = (owner, data = {}) => ({
  name: data.name,
  cover: data.cover,
  remarks: data.remarks,
  likes: 0,
  tradeRequests: 0,
  isTrading: false,
  isTraded: false,
  isDirty: false,
  owner: owner.key,
  ownerInfo: {
    firstName: owner.firstName || '',
    address: owner.address || '',
  },
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

/**
 * ownerInfoUpdate.
 *
 * @param {object} owner
 */
export const ownerInfoUpdate = (owner) => ({
  ownerInfo: {
    firstName: owner.firstName,
    address: owner.address,
  },
});

export default {
  incrementTotalItems,
  newItem,
  updatedItem,
  ownerInfoUpdate,
};
