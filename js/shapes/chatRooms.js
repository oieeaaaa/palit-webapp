import firebaseApp from 'firebase/app';

/**
 * chatRoomUser.
 *
 * @param {object} user
 */
export const chatRoomUser = (user) => ({
  firstName: user.firstName,
  lastName: user.lastName,
  avatar: user.avatar,
});

/**
 * newChatRoomUser.
 *
 * @param {object} user
 */
export const newChatRoomUser = (user) => ({
  userID: user.key,
  isUnread: false,
  ...chatRoomUser(user),
});

/**
 * newUserChatRoom.
 */
export const newUserChatRoom = () => ({
  isUnread: false,
});

/**
 * newChatRoom.
 *
 * @param {string} hostID
 * @param {string} memberID
 */
export const newChatRoom = (hostID, memberID) => ({
  hostID,
  members: [
    hostID,
    memberID,
  ],
});

// ===========================================================================
// MESSAGES
// ===========================================================================

/**
 * messageSender.
 *
 * @param {object} user
 */
export const messageSender = (user) => ({
  sender: {
    firstName: user.firstName,
    lastName: user.lastName,
    avatar: user.avatar,
  },
});

/**
 * newMessage.
 *
 * @param {object} data
 */
export const newMessage = (data) => ({
  sender: {
    key: data.user.key,
    ...messageSender(data),
  },
  content: data.content,
  timestamp: firebaseApp.firestore.FieldValue.serverTimestamp(),
});

/**
 * latestMessage.
 *
 * @param {object} data
 */
export const latestMessage = (data) => ({
  latestMessage: {
    senderID: data.user.key,
    content: data.content,
    timestamp: firebaseApp.firestore.FieldValue.serverTimestamp(),
  },
  isUnread: true,
});

/**
 * readMessage.
 */
export const readMessage = () => ({
  isUnread: false,
});

export default {
  newChatRoom,
  newChatRoomUser,
  newUserChatRoom,
  newMessage,
  latestMessage,
  readMessage,
  messageSender,
};
