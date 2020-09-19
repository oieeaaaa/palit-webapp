import firebase from 'palit-firebase';

const usersRef = firebase.database().ref('users');

/**
 * add.
 *
 * @param {string} userID
 * @param {object} data
 */
const add = (userID, data) => (
  // e.g., /users/john
  usersRef.push({
    [userID]: {
      address: data.address,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
    },
  })
);

export default {
  add,
};
