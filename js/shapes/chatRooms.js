import firebaseApp from 'firebase/app';

/**
 * newChatRoomUser.
 *
 * @param {object} user
 */
export const newChatRoomUser = (user) => ({
  userID: user.key,
  firstName: user.firstName,
  lastName: user.lastName,
  avatar: user.avatar,
  isUnread: true,
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
 * @param {object} host
 * @param {object} member
 */
export const newChatRoom = (host, member) => ({
  host: newChatRoomUser(host),
  member: newChatRoomUser(member),
});

/**
 * newMessage.
 *
 * @param {object} data
 */
export const newMessage = (data) => ({
  sender: {
    key: data.user.key,
    firstName: data.user.firstName,
    lastName: data.user.lastName,
    avatar: data.user.avatar,
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
};
