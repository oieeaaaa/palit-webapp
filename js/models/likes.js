import firebase from 'palit-firebase';
import firebaseApp from 'firebase/app';

const db = firebase.firestore();
const likesCollection = db.collection('likes');
const itemsCollection = db.collection('items');
const tradeRequestsCollection = db.collection('tradeRequests');
const requestsCollectionGroup = db.collectionGroup('requests');

/**
 * add.
 *
 * @param {string} userID
 * @param {string} itemID
 */
const add = async (userID, itemID) => {
  // refs
  const likeRef = likesCollection.doc(itemID);
  const itemRef = itemsCollection.doc(itemID);
  const tradeRequestRef = tradeRequestsCollection.doc(itemID);

  // add
  return db.runTransaction(async (transaction) => {
    const item = await transaction.get(itemRef);

    if (item.isTrading || item.isTraded) {
      const requests = await requestsCollectionGroup.where('id', '==', itemID).get();

      requests.forEach((request) => {
        transaction.update(
          request.ref,
          { likes: firebaseApp.firestore.FieldValue.increment(1) },
        );
      });

      transaction.update(tradeRequestRef, {
        likes: firebaseApp.firestore.FieldValue.increment(1),
      });
    }

    transaction.set(likeRef, { [userID]: true }, { merge: true });
    transaction.update(itemRef, { likes: firebaseApp.firestore.FieldValue.increment(1) });
  });
};

/**
 * remove.
 *
 * @param {string} userID
 * @param {string} itemID
 */
const remove = async (userID, itemID) => {
  // refs
  const likeRef = likesCollection.doc(itemID);
  const itemRef = itemsCollection.doc(itemID);
  const tradeRequestRef = tradeRequestsCollection.doc(itemID);

  // remove
  return db.runTransaction(async (transaction) => {
    const item = await transaction.get(itemRef);

    if (item.isTrading || item.isTraded) {
      const requests = await requestsCollectionGroup.where('id', '==', itemID).get();

      requests.forEach((request) => {
        transaction.update(
          request.ref,
          { likes: firebaseApp.firestore.FieldValue.increment(-1) },
        );
      });

      transaction.update(tradeRequestRef, {
        likes: firebaseApp.firestore.FieldValue.increment(-1),
      });
    }

    transaction.set(likeRef, {
      [userID]: firebaseApp.firestore.FieldValue.delete(),
    }, { merge: true });
    transaction.update(itemRef, { likes: firebaseApp.firestore.FieldValue.increment(-1) });
  });
};

/**
 * getOne.
 *
 * @type {string} itemID
 */
const getOne = (itemID) => likesCollection.doc(itemID).get();

export default {
  add,
  getOne,
  remove,
};
