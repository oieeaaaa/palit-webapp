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

export default {
  newChatRoom,
  newChatRoomUser,
  newUserChatRoom,
};
