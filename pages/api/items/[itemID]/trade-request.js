import { db } from 'admin';
import { successPayload, errorPayload } from 'js/shapes/commons';
import { normalizeData } from 'js/utils';
import messages from 'js/messages';
import api from 'js/helpers/api';

const tradeRequestsCollection = db.collection('tradeRequests');

/**
 * getTradeRequest.
 *
 * @param {object} req
 * @param {object} res
 */
const getTradeRequest = async (req, res) => {
  const { itemID, limit } = req.query;

  try {
    const tradeRequestItemRef = tradeRequestsCollection.doc(itemID);
    const requests = await tradeRequestItemRef.collection('requests').limit(limit || 10).get();
    const requestsStats = await tradeRequestsCollection
      .doc(itemID)
      .collection('requests')
      .doc('--stats--').get();

    const tradeRequests = db.runTransaction(async (transaction) => {
      const rawTradeRequestItem = await transaction.get(tradeRequestItemRef);

      if (!rawTradeRequestItem) return null;

      // kudos to doug for providing this snippet below 🎉
      const requestsInTransaction = [];

      for (const doc of requests.docs) {
        if (doc.id !== '--stats--') {
          const requestInTransaction = await transaction.get(doc.ref);
          requestsInTransaction.push(normalizeData(requestInTransaction));
        }
      }

      // https://stackoverflow.com/questions/63995150/how-to-query-subcollection-inside-transaction-in-firebase/63995746#63995746

      return {
        ...normalizeData(rawTradeRequestItem),
        requests: requestsInTransaction,
        stats: requestsStats,
      };
    });

    successPayload(res, {
      data: tradeRequests,
      message: messages.success.retrieved,
    });
  } catch (error) {
    errorPayload(res, {
      message: messages.error.common,
      error: error.message,
    });
  }
};

export default api({ get: getTradeRequest });
