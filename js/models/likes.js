import firebase from 'palit-firebase';

const db = firebase.firestore();

/**
 * add.
 *
 * Writing in batch fashion 😎
 *
 * @param {string} userID
 * @param {object} item
 */
const add = (userID, item) => {
  const batch = db.batch();

  // const increment = firebase.firestore.FieldValue.increment(1);

  const likesRef = db.collection('likes').doc(item.id);
  const itemsRef = db.collection('items').doc(item.id);

  batch.set(likesRef, { [userID]: true });
  batch.update(itemsRef, { likes: item.likes + 1 });

  return batch.commit();
};

export default {
  add,
};
