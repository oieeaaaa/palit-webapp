import firebaseApp from 'firebase/app';
import { valueFallback } from 'js/utils';

/**
 * chatRoomUser.
 *
 * @param {object} user
 */
export const chatRoomUser = (user) => ({
  firstName: valueFallback(user.firstName, 'string'),
  lastName: valueFallback(user.lastName, 'string'),
  avatar: valueFallback(user.avatar, 'string'),
});

/**
 * newChatRoomUser.
 *
 * @param {object} user
 */
export const newChatRoomUser = (user) => ({
  userID: valueFallback(user.key, 'string'),
  isUnread: false,
  firstName: valueFallback(user.firstName, 'string'),
  lastName: valueFallback(user.lastName, 'string'),
  avatar: valueFallback(user.avatar, 'string'),
  latestMessage: {
    senderID: '',
    content: '',
    timestamp: '',
  },
});

/**
 * newUserChatRoom.
 */
export const newUserChatRoom = () => ({
  theme: '',
  isUnread: false,
  doNotDisturb: false,
});

/**
 * userChatRoomUpdate.
 *
 * @param {object} data
 */
export const userChatRoomUpdate = (data) => ({
  theme: valueFallback(data.theme, 'string'),
  doNotDisturb: valueFallback(data.doNotDisturb, 'boolean'),
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
    firstName: valueFallback(user.firstName, 'string'),
    lastName: valueFallback(user.lastName, 'string'),
    avatar: valueFallback(user.avatar, 'string'),
  },
});

/**
 * newMessage.
 *
 * @param {object} data
 */
export const newMessage = (data) => ({
  sender: {
    key: valueFallback(data.user.key, 'string'),
    firstName: valueFallback(data.user.firstName, 'string'),
    lastName: valueFallback(data.user.lastName, 'string'),
    avatar: valueFallback(data.user.avatar, 'string'),
  },
  content: valueFallback(data.content, 'string'),
  timestamp: firebaseApp.firestore.FieldValue.serverTimestamp(),
});

/**
 * latestMessage.
 *
 * @param {object} data
 */
export const latestMessage = (data) => ({
  latestMessage: {
    senderID: valueFallback(data.user.key, 'string'),
    content: valueFallback(data.content, 'string'),
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
  userChatRoomUpdate,
};
