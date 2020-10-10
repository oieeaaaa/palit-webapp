import firebase from 'palit-firebase';

const db = firebase.firestore();
const usersCollection = db.collection('users');

const defaultUser = {
  firstName: '',
  lastName: '',
  avatar: '',
  phoneNumber: '',
  messengerLink: '',
  address: '',
  email: '',
};

/**
 * add.
 *
 * @param {string} userID
 * @param {object} data
 */
const add = (userID, data = {}) => usersCollection.doc(userID).set({
  ...defaultUser,
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
  defaultUser,
};
