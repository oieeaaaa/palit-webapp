import { db } from 'admin';
import { successPayload, errorPayload } from 'js/shapes/commons';
import { normalizeData } from 'js/utils';
import messages from 'js/messages';
import api from 'js/helpers/api';

const itemsCollection = db.collection('items');
const itemsStats = db.collection('items').doc('--stats--');
const tradeRequestsCollection = db.collection('tradeRequests');
const likesCollection = db.collection('likes');

/**
 * getAllItems.
 *
 * @param {object} req
 * @param {object} res
 */
const getAllItems = async (req, res) => {
  const { userID, limit } = req.query;

  try {
    // items
    const rawItems = await itemsCollection
      .where('owner', '!=', userID)
      .where('isTraded', '==', false)
      .limit(parseInt(limit, 10) || 10)
      .get();

    const items = await db.runTransaction(async (transaction) => {
      const newItems = [];

      for (const rawItem of rawItems.docs) {
        const rawRequests = await tradeRequestsCollection.doc(rawItem.id).collection('requests').get();
        const rawLikes = await transaction.get(likesCollection.doc(rawItem.id));
        const isTradingPartner = !rawRequests.empty && rawRequests.docs.some(
          (rawRequest) => normalizeData(rawRequest).owner === userID,
        );

        newItems.push({
          ...normalizeData(rawItem),
          key: rawItem.id,

          // with this
          isLiked: rawLikes.exists ? Object.keys(normalizeData(rawLikes)).includes(userID) : false,
          isTradingPartner,
        });
      }

      return newItems;
    });

    // stats
    const rawStats = await itemsStats.get();
    const stats = normalizeData(rawStats);

    successPayload(res, {
      message: messages.success.retrieved,
      data: {
        items,
        stats,
      },
    });
  } catch (error) {
    errorPayload(res, {
      message: messages.error.common,
      error: error.message,
    });
  }
};

export default api({ get: getAllItems });
