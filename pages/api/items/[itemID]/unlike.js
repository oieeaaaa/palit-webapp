import { db } from 'admin';
import { successPayload, errorPayload } from 'js/shapes/commons';
import { incrementLikes, removeUser } from 'js/shapes/likes';
import { normalizeData } from 'js/utils';
import messages from 'js/messages';
import api from 'js/helpers/api';

const likesCollection = db.collection('likes');
const itemsCollection = db.collection('items');
const tradeRequestsCollection = db.collection('tradeRequests');
const requestsCollectionGroup = db.collectionGroup('requests');

/**
 * unlike.
 *
 * @param {object} req
 * @param {object} res
 */
const unlike = async (req, res) => {
  const { itemID } = req.query;
  const { userID } = req.body;

  try {
    // refs
    const likeRef = likesCollection.doc(itemID);
    const itemRef = itemsCollection.doc(itemID);
    const tradeRequestRef = tradeRequestsCollection.doc(itemID);

    // remove
    await db.runTransaction(async (transaction) => {
      const rawItem = await transaction.get(itemRef);
      const item = normalizeData(rawItem);

      if (item.isTrading || item.isTraded) {
        const requests = await requestsCollectionGroup.where('key', '==', itemID).get();
        const tradeRequest = await tradeRequestRef.get();

        if (!requests.empty) {
          requests.forEach((request) => {
            transaction.set(request.ref, incrementLikes(-1), { merge: true });
          });
        }

        if (tradeRequest.exists) {
          transaction.set(tradeRequestRef, incrementLikes(-1), { merge: true });
        }
      }

      transaction.set(likeRef, removeUser(userID), { merge: true });

      transaction.set(itemRef, incrementLikes(-1), { merge: true });
    });

    successPayload(res, {
      key: userID,
      message: messages.success.common,
    });
  } catch (error) {
    errorPayload(res, {
      message: messages.error.common,
      error: error.message,
    });
  }
};

export default api({ delete: unlike });
