import firebase from 'palit-firebase';
import {
  newChatRoom,
  newChatRoomUser,
  newUserChatRoom,
  newMessage,
  latestMessage,
  readMessage,
} from 'js/shapes/chatRooms';
import { normalizeData } from 'js/utils';

const db = firebase.firestore();

// collections
const chatRoomsCollection = db.collection('chatRooms');
const usersCollection = db.collection('users');
const usersChatRoomsCollection = db.collection('usersChatRooms');

/**
 * add.
 *
 * @param {string} hostID
 * @param {string} memberID
 */
const add = (hostID, memberID) => db.runTransaction(async (transaction) => {
  // chatRooms collections
  const newChatRoomID = chatRoomsCollection.doc().id;
  const newChatRoomRef = chatRoomsCollection.doc(newChatRoomID);

  // usersChatRooms collections
  const hostChatRoomCollection = usersChatRoomsCollection.doc(hostID);
  const memberChatRoomCollection = usersChatRoomsCollection.doc(memberID);
  const hostChatRoomSubCollection = hostChatRoomCollection.collection('_chatRooms');
  const memberChatRoomSubCollection = memberChatRoomCollection.collection('_chatRooms');

  // users
  const rawHost = await transaction.get(usersCollection.doc(hostID));
  const rawMember = await transaction.get(usersCollection.doc(memberID));
  const host = normalizeData(rawHost);
  const member = normalizeData(rawMember);

  // chatRooms
  await transaction.set(newChatRoomRef, newChatRoom(host, member), { merge: true });

  // usersChatRooms
  await transaction.set(hostChatRoomCollection, newUserChatRoom(), { merge: true });
  await transaction.set(memberChatRoomCollection, newUserChatRoom(), { merge: true });

  await transaction.set(
    hostChatRoomSubCollection.doc(newChatRoomID),
    newChatRoomUser(member),
    { merge: true },
  );

  await transaction.set(
    memberChatRoomSubCollection.doc(newChatRoomID),
    newChatRoomUser(host),
    { merge: true },
  );
});

/**
 * getUserChatRoomsWithMember.
 *
 * @param {string} userID
 * @param {string} memberID
 */
const getUserChatRoomsWithMember = (userID, memberID) => (
  usersChatRoomsCollection
    .doc(userID)
    .collection('_chatRooms')
    .where('userID', '==', memberID)
    .get()
);

/**
 * getAllUserChatRooms.
 *
 * @param {string} userID
 */
const getAllUserChatRooms = (userID) => (
  usersChatRoomsCollection
    .doc(userID)
    .collection('_chatRooms')
    .get()
);

/**
 * userChatRoomsListener.
 *
 * @param {string} userID
 * @param {function} listener
 */
const userChatRoomsListener = (userID, listener) => (
  usersChatRoomsCollection
    .doc(userID)
    .collection('_chatRooms')
    .onSnapshot(listener)
);

/**
 * messagesListener.
 *
 * @param {string} chatRoomID
 * @param {function} listener
 */
const messagesListener = (chatRoomID, listener) => (
  chatRoomsCollection
    .doc(chatRoomID)
    .collection('messages')
    .orderBy('timestamp', 'asc')
    .onSnapshot(listener)
);

/**
 * addMessage.
 *
 * @param {string} userID
 * @param {string} memberID
 * @param {string} chatRoomID
 * @param {object} data
 */
const addMessage = (userID, memberID, chatRoomID, data) => {
  // collections & refs
  const messagesCollection = chatRoomsCollection.doc(chatRoomID).collection('messages');
  const userChatRoom = usersChatRoomsCollection.doc(userID).collection('_chatRooms').doc(chatRoomID);
  const memberChatRoom = usersChatRoomsCollection.doc(memberID).collection('_chatRooms').doc(chatRoomID);

  // new message id
  const messageID = messagesCollection.doc().id;

  db.runTransaction(async (transaction) => {
    // messages
    await transaction.set(messagesCollection.doc(messageID), newMessage(data), { merge: true });

    // usersChatRooms > _chatRooms
    await transaction.set(userChatRoom, {
      ...latestMessage(data),
      ...readMessage(),
    }, { merge: true });

    await transaction.set(memberChatRoom, latestMessage(data), { merge: true });
  });
};

/**
 * openChatRoom.
 * Check, Create, Fetch
 *
 * @param {string} userID
 * @param {string} memberID
 */
const openChatRoom = async (userID, memberID) => {
  // check
  const userChatRoomWithMember = await getUserChatRoomsWithMember(userID, memberID);

  // create a connection if it's new
  if (userChatRoomWithMember.empty) {
    await add(userID, memberID);
  }

  // fetch
  const newRawUserChatRoomWithMember = await getUserChatRoomsWithMember(userID, memberID);
  const newUserChatRoomWithMember = normalizeData(newRawUserChatRoomWithMember)[0];

  return newUserChatRoomWithMember;
};

/**
 * readChatRoomMessage.
 *
 * @param {string} userID
 * @param {chatRoomID} chatRoomID
 */
const readChatRoomMessage = (userID, chatRoomID) => {
  const userChatRoomMember = usersChatRoomsCollection.doc(userID).collection('_chatRooms').doc(chatRoomID);

  return db.runTransaction(async (transaction) => {
    const userChatRoomMemberRawData = await transaction.get(userChatRoomMember);
    const userChatRoomMemberData = normalizeData(userChatRoomMemberRawData);

    // the message is seen by the current User
    if (userChatRoomMemberData.isUnread) {
      await transaction.set(userChatRoomMember, readMessage(), { merge: true });
    }
  });
};

export default {
  add,
  getUserChatRoomsWithMember,
  openChatRoom,
  messagesListener,
  getAllUserChatRooms,
  addMessage,
  userChatRoomsListener,
  readChatRoomMessage,
};
