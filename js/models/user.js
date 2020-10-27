import firebase from 'palit-firebase';
import { ownerInfoUpdate } from 'js/shapes/item';
import { messageSender, chatRoomUser } from 'js/shapes/chatRooms';

const db = firebase.firestore();

// collections
const usersCollection = db.collection('users');
const itemsCollection = db.collection('items');

// collection groups
const messagesCollectionGroup = db.collectionGroup('messages');
const chatRoomsCollectionGroup = db.collectionGroup('_chatRooms');

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
const update = async (userID, user) => {
  const rawUserItems = await itemsCollection.where('owner', '==', userID).get();
  const rawUserMessages = await messagesCollectionGroup.where('sender.key', '==', userID).get();
  const rawUserChatRooms = await chatRoomsCollectionGroup.where('userID', '==', userID).get();

  return db.runTransaction(async (transaction) => {
    await transaction.update(usersCollection.doc(userID), user);

    // items > ownerInfo
    if (!rawUserItems.empty) {
      for (const item of rawUserItems.docs) {
        await transaction.set(item.ref, ownerInfoUpdate(user), { merge: true });
      }
    }

    // chatRooms > messages > sender
    if (!rawUserMessages.empty) {
      for (const message of rawUserMessages.docs) {
        await transaction.set(message.ref, messageSender(user), { merge: true });
      }
    }

    // usersChatRooms > _chatRooms
    if (!rawUserChatRooms.empty) {
      for (const chatRoom of rawUserChatRooms.docs) {
        await transaction.set(chatRoom.ref, chatRoomUser(user), { merge: true });
      }
    }
  });
};

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
