import { db } from 'admin';
import { successPayload, errorPayload } from 'js/shapes/item';
import messages from 'js/messages';
import api from 'js/helpers/api';

const itemsCollection = db.collection('items');

/**
 * cleanDirty.
 *
 * @param {object} req
 * @param {object} res
 */
const cleanDirty = async (req, res) => {
  const { itemID } = req.query;

  try {
    await itemsCollection.doc(itemID).update({
      isDirty: false,
    });

    successPayload(res, {
      message: messages.success.common,
    });
  } catch (error) {
    errorPayload(res, {
      message: messages.error.common,
      error: error.message,
    });
  }
};

export default api({ put: cleanDirty });
