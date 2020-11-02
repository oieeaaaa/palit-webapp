import { db } from 'admin';
import { normalizeData } from 'js/utils';
import {
  successPayload,
  errorPayload,
} from 'js/shapes/commons';
import messages from 'js/messages';
import api from 'js/helpers/api';

const itemsCollection = db.collection('items');
const tradeRequestsCollection = db.collection('tradeRequests');

/**
 * getItemsToTrade.
 *
 * @param {object} req
 * @param {object} res
 */
const getItemsToTrade = async (req, res) => {
  const { userID, itemToTradeID } = req.query;

  try {
    const rawItems = await itemsCollection.where('owner', '==', userID).where('isTraded', '==', false).get();
    const newItems = [];

    for (const rawItem of rawItems.docs) {
      let isItemAlreadyTraded = false;
      const rawRequests = await tradeRequestsCollection.doc(itemToTradeID).collection('requests').get();

      if (!rawRequests.empty) {
        for (const rawRequest of rawRequests.docs) {
          if (rawRequest.id === rawItem.id) {
            isItemAlreadyTraded = true;
          }
        }
      }

      if (!isItemAlreadyTraded) {
        newItems.push(normalizeData(rawItem));
      }
    }

    successPayload(res, {
      data: newItems,
      message: messages.success.retrieved,
    });
  } catch (error) {
    errorPayload(res, {
      message: messages.error.common,
      error: error.message,
    });
  }
};

export default api({ get: getItemsToTrade });
