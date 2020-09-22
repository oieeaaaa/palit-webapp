import firebase from 'palit-firebase';
import firebaseApp from 'firebase/app';

const db = firebase.firestore();
const tradeRequestsRef = db.collection('tradeRequests');
const itemRef = db.collection('items');

const add = (myItem, itemToTrade) => {
  const batch = db.batch();

  // My Item
  const myItemRef = tradeRequestsRef.doc(myItem.key);
  const myItemRequestsItemRef = myItemRef.collection('requests').doc(itemToTrade.key);

  // Item to trade
  const itemToTradeRef = tradeRequestsRef.doc(itemToTrade.key);
  const itemToTradeRequestsItemRef = itemToTradeRef.collection('requests').doc(myItem.key);

  // misc
  batch.update(itemRef.doc(myItem.key), {
    tradeRequests: firebaseApp.firestore.FieldValue.increment(1),
  });

  batch.update(itemRef.doc(itemToTrade.key), {
    tradeRequests: firebaseApp.firestore.FieldValue.increment(1),
  });

  batch.set(myItemRef, { isAccepted: false });
  batch.set(myItemRequestsItemRef, {
    cover: itemToTrade.cover,
    name: itemToTrade.name,
    isTraded: itemToTrade.isTraded,
    likes: itemToTrade.likes,
    tradeRequests: firebaseApp.firestore.FieldValue.increment(1),
    owner: itemToTrade.owner,
  });

  batch.set(itemToTradeRef, { isAccepted: false });
  batch.set(itemToTradeRequestsItemRef, {
    cover: myItem.cover,
    name: myItem.name,
    isTraded: myItem.isTraded,
    likes: myItem.likes,
    tradeRequests: firebaseApp.firestore.FieldValue.increment(1),
    owner: myItem.owner,
  });

  batch.commit();
};

/**
 * getOne
 *
 * Woah.
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
