import firebase from 'palit-firebase';
import {
  newChatRoom,
  newChatRoomUser,
  newUserChatRoom,
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
  const rawUsersChatRooms = await getAllUserChatRooms(userID);
  const usersChatRooms = normalizeData(rawUsersChatRooms);

  // return with isActive state
  return usersChatRooms.map((userChatRoom) => {
    userChatRoom.isActive = false;

    if (userChatRoom.userID === memberID) {
      userChatRoom.isActive = true;
    }

    return userChatRoom;
  });
};

export default {
  add,
  getUserChatRoom: getUserChatRoomsWithMember,
  openChatRoom,
};
