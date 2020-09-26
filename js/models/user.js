import firebase from 'palit-firebase';

const db = firebase.firestore();
const usersCollection = db.collection('users');

/**
 * add.
 *
 * @param {string} userID
 * @param {object} data
 */
const add = (userID, email) => usersCollection.doc(userID).set({
  email,
  firstName: '',
  lastName: '',
  avatar: '',
  address: '',
  messagerLink: '',
});

/**
 * getOne.
 *
 * @param {string} userID
 */
const getOne = (userID) => usersCollection.doc(userID).get();

export default {
  add,
  getOne,
};
