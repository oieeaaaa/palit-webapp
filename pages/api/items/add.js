import { db } from 'admin';
import {
  incrementTotalItems,
  newItem,
} from 'js/shapes/item';
import { successPayload, errorPayload } from 'js/shapes/commons';
import api from 'js/helpers/api';

const itemsCollection = db.collection('items');
const itemsStats = db.collection('items').doc('--stats--');

/**
 * addItem.
 *
 * @param {object} req
 * @param {object} res
 */
const addItem = async (req, res) => {
  const {
    owner,
    item,
  } = req.body;

  try {
    const batch = db.batch();
    const newDocumentID = itemsCollection.doc().id;

    batch.set(itemsStats, incrementTotalItems(1), { merge: true });

    batch.set(itemsCollection.doc(newDocumentID), newItem(owner, item), { merge: true });

    batch.commit();

    successPayload(res, {
      message: 'Item is added.',
    });
  } catch (error) {
    errorPayload(res, {
      message: 'Failed to add item.',
      error: error.message,
    });
  }
};

export default api({ post: addItem });
