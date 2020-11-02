import { db } from 'admin';
import { successPayload, errorPayload } from 'js/shapes/commons';
import { ownerInfoUpdate } from 'js/shapes/item';
import { messageSender, chatRoomUser } from 'js/shapes/chatRooms';
import { normalizeData } from 'js/utils';
import messages from 'js/messages';
import api from 'js/helpers/api';

const usersCollection = db.collection('users');
const itemsCollection = db.collection('items');
const messagesCollectionGroup = db.collectionGroup('messages');
const chatRoomsCollectionGroup = db.collectionGroup('_chatRooms');

/**
 * updateUser.
 *
 * @param {object} req
 * @param {object} res
 */
const updateUser = async (req, res) => {
  const { body: user, query } = req;
  const { userID } = query;

  try {
    const rawUserItems = await itemsCollection.where('owner', '==', userID).get();
    const rawUserMessages = await messagesCollectionGroup.where('sender.key', '==', userID).get();
    const rawUserChatRooms = await chatRoomsCollectionGroup.where('userID', '==', userID).get();

    await db.runTransaction(async (transaction) => {
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

    successPayload(res, {
      key: userID,
      message: messages.error.updated,
    });
  } catch (error) {
    errorPayload(res, {
      message: messages.error.common,
      error: error.message,
    });
  }
};

/**
 * getUser.
 *
 * @param {object} req
 * @param {object} res
 */
const getUser = async (req, res) => {
  const { userID } = req.query;

  try {
    const user = await usersCollection.doc(userID).get();

    successPayload(res, {
      data: normalizeData(user),
      message: messages.success.retrieved,
    });
  } catch (error) {
    errorPayload(res, {
      message: messages.error.common,
    });
  }
};

export default api({ get: getUser, put: updateUser });
