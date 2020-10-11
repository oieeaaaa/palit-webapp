import firebaseApp from 'firebase/app';

/**
 * newTradeRequest.
 *
 * @param {object} data
 */
export const newTradeRequest = (data = {}) => ({
  key: data.key,
  name: data.name,
  owner: data.owner,
  tradeRequests: data.tradeRequests + 1,
  likes: data.tradeRequests,
  isTraded: data.isTraded,
  isAccepted: false,
});

/**
 * requestShape.
 *
 * @param {object} data
 */
export const newRequest = (data = {}) => ({
  key: data.key,
  name: data.name,
  cover: data.cover,
  owner: data.owner,
  isTraded: data.isTraded,
  likes: data.likes,
  tradeRequests: data.tradeRequests + 1,
});

/**
 * incrementTradeRequests.
 *
 * @param {number} amount
 */
export const incrementTradeRequests = (amount = 0) => ({
  tradeRequests: firebaseApp.firestore.FieldValue.increment(amount),
});

/**
 * incrementTotalRequests.
 *
 * @param {number} amount
 */
export const incrementTotalRequests = (amount = 0) => ({
  totalRequests: firebaseApp.firestore.FieldValue.increment(amount),
});

/**
 * acceptedItemStatus.
 */
export const acceptedItemStatus = () => ({
  isTraded: true,
  isTrading: false,
});

/**
 * acceptedTradeRequest.
 *
 * @param {object} data
 */
export const acceptedTradeRequest = (data = {}) => ({
  isAccepted: true,
  isTraded: true,
  acceptedItem: {
    key: data.key,
    owner: data.owner,
  },
});

export default {
  newTradeRequest,
  newRequest,
  incrementTradeRequests,
  incrementTotalRequests,
  acceptedItemStatus,
  acceptedTradeRequest,
};
