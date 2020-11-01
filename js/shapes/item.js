import admin from 'admin';
import { valueFallback } from 'js/utils';

/**
 * incrementTotalItems.
 *
 * @param {number} amount
 */
export const incrementTotalItems = (amount = 0) => ({
  totalItems: admin.firestore.FieldValue.increment(amount),
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
    firstName: valueFallback(owner.firstName, 'string'),
    address: valueFallback(owner.address, 'string'),
  },
});

/**
 * updatedItem.
 *
 * @param {object} data
 */
export const updatedItem = (data = {}) => ({
  name: valueFallback(data.name, 'string'),
  cover: valueFallback(data.cover, 'string'),
  remarks: valueFallback(data.remarks, 'string'),
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
