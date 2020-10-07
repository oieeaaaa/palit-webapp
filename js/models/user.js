import firebase from 'palit-firebase';

const db = firebase.firestore();
const usersCollection = db.collection('users');

/**
 * add.
 *
 * @param {string} userID
 * @param {object} data
 */
const add = (userID, data = {}) => usersCollection.doc(userID).set({
  firstName: '',
  lastName: '',
  avatar: '',
  address: '',
  messagerLink: '',
  ...data,
});

/**
 * update
 *
 * @param {object} user
 */
const update = (userID, user) => usersCollection.doc(userID).update(user);

/**
 * getOne.
 *
 * @param {string} userID
 */
const getOne = (userID) => usersCollection.doc(userID).get();

export default {
  add,
  update,
  getOne,
};
