import firebase from 'palit-firebase';
import { incrementLikes, newUser, removeUser } from 'js/shapes/likes';
import { normalizeData } from 'js/utils';

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
    const rawItem = await transaction.get(itemRef);
    const item = normalizeData(rawItem);

    if (item.isTrading || item.isTraded) {
      const requests = await requestsCollectionGroup.where('key', '==', itemID).get();

      requests.forEach((request) => {
        transaction.set(request.ref, incrementLikes(1), { merge: true });
      });

      transaction.set(tradeRequestRef, incrementLikes(1), { merge: true });
    }

    transaction.set(likeRef, newUser(userID), { merge: true });

    transaction.set(itemRef, incrementLikes(1), { merge: true });
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
    const rawItem = await transaction.get(itemRef);
    const item = normalizeData(rawItem);

    if (item.isTrading || item.isTraded) {
      const requests = await requestsCollectionGroup.where('key', '==', itemID).get();

      requests.forEach((request) => {
        transaction.set(request.ref, incrementLikes(-1), { merge: true });
      });

      transaction.set(tradeRequestRef, incrementLikes(-1), { merge: true });
    }

    transaction.set(likeRef, removeUser(userID), { merge: true });

    transaction.set(itemRef, incrementLikes(-1), { merge: true });
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
