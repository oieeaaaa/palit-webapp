import firebase from 'palit-firebase';
import { normalizeData } from 'js/utils';

const db = firebase.firestore();
const tradeRequestsRef = db.collection('tradeRequests');

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
        name: data.name,
        likes: data.likes,
        tradeRequests: data.tradeRequests,
      },
    })
);

/**
 * getOne
 *
 * @type {string} itemID
 */
const getOne = async (itemID) => {
  const tradeRequestItemRef = tradeRequestsRef.doc(itemID);
  const requests = await tradeRequestItemRef.collection('requests').get();

  return db.runTransaction(async (transaction) => {
    const rawTradeRequestItem = await transaction.get(tradeRequestItemRef);

    if (!rawTradeRequestItem) return null;

    // kudos to doug for providing this snippet below 🎉
    const requestsInTransaction = [];

    for (const doc of requests.docs) { // eslint-disable-line
      const requestInTransaction = await transaction.get(doc.ref); // eslint-disable-line
      requestsInTransaction.push({
        ...requestInTransaction.data(),
        key: requestInTransaction.id,
      });
    }
    // https://stackoverflow.com/questions/63995150/how-to-query-subcollection-inside-transaction-in-firebase/63995746#63995746

    return {
      ...rawTradeRequestItem.data(),
      requests: requestsInTransaction,
    };
  });
};

export default {
  add,
  getOne,
};
