import firebaseApp from 'firebase/app';
import firebase from 'palit-firebase';

const db = firebase.firestore();
const likesRef = db.collection('likes');
const itemsRef = db.collection('items');

/**
 * add.
 *
 * Writing in batch fashion 😎
 *
 * @param {string} userID
 * @param {string} itemID
 */
const add = (userID, itemID) => {
  const batch = db.batch();

  const likeRef = likesRef.doc(itemID);
  const itemRef = itemsRef.doc(itemID);

  batch.set(likeRef, { [userID]: true });

  // TODO: One like per user
  batch.update(itemRef, { likes: firebaseApp.firestore.FieldValue.increment(1) });

  batch.commit();
};

/**
 * remove.
 *
 * @param {string} userID
 * @param {string} itemID
 */
const remove = (userID, itemID) => {
  const batch = db.batch();

  const likeRef = likesRef.doc(itemID);
  const itemRef = itemsRef.doc(itemID);

  batch.update(likeRef, { [userID]: firebaseApp.firestore.FieldValue.delete() });
  batch.update(itemRef, { likes: firebaseApp.firestore.FieldValue.increment(-1) });

  batch.commit();
};

/**
 * getOne.
 *
 * @type {string} itemID
 */
const getOne = (itemID) => likesRef.doc(itemID).get();

export default {
  add,
  getOne,
  remove,
};
