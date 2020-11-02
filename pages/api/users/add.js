import { db } from 'admin';
import { successPayload, errorPayload } from 'js/shapes/commons';
import api from 'js/helpers/api';

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
 * addUser.
 *
 * @param {object} req
 * @param {object} res
 */
const addUser = async (req, res) => {
  const { userID } = req.query;

  try {
    await usersCollection.doc(userID).set({
      ...defaultUser,
      ...req.body,
    });

    successPayload(res, {
      key: userID,
      message: 'Nice!',
    });
  } catch (error) {
    errorPayload(res, {
      message: 'Oh no, Something failed',
      error: error.message,
    });
  }
};

export default api({ post: addUser });
