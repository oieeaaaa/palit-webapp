import firebase from 'palit-firebase';
import firebaseApp from 'firebase/app';

const db = firebase.firestore();
const likesCollection = db.collection('likes');
const itemsCollection = db.collection('items');
const requestsCollectionGroup = db.collectionGroup('requests');

/**
 * add.
 *
 * Writing in batch fashion 😎
 *
 * @param {string} userID
 * @param {string} itemID
 */
const add = async (userID, itemID) => {
  const batch = db.batch();
  const likeRef = likesCollection.doc(itemID);
  const itemRef = itemsCollection.doc(itemID);
  const requests = await requestsCollectionGroup.where('id', '==', itemID).get();

  requests.forEach((request) => {
    batch.update(request.ref, { likes: firebaseApp.firestore.FieldValue.increment(1) });
  });

  batch.set(likeRef, { [userID]: true }, { merge: true });
  batch.update(itemRef, { likes: firebaseApp.firestore.FieldValue.increment(1) });

  batch.commit();
};

/**
 * remove.
 *
 * @param {string} userID
 * @param {string} itemID
 */
const remove = async (userID, itemID) => {
  const batch = db.batch();
  const likeRef = likesCollection.doc(itemID);
  const itemRef = itemsCollection.doc(itemID);
  const requests = await requestsCollectionGroup.where('id', '==', itemID).get();

  requests.forEach((request) => {
    batch.update(request.ref, { likes: firebaseApp.firestore.FieldValue.increment(-1) });
  });

  batch.update(likeRef, { [userID]: firebaseApp.firestore.FieldValue.delete() });
  batch.update(itemRef, { likes: firebaseApp.firestore.FieldValue.increment(-1) });

  batch.commit();
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
