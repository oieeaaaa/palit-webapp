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
});

/**
 * newUserChatRoom.
 */
export const newUserChatRoom = () => ({
  isDirty: false,
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

export default {
  newChatRoom,
  newChatRoomUser,
  newUserChatRoom,
  newMessage,
};
