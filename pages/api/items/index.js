import { db } from 'admin';
import { normalizeData } from 'js/utils';
import api from 'js/helpers/api';

const itemsCollection = db.collection('items');

const getAllItems = async (req, res) => {
  const { userID, limit } = req.body;

  const rawItems = await itemsCollection
    .where('owner', '!=', userID)
    .where('isTraded', '==', false)
    .limit(parseInt(limit, 10) || 10)
    .get();

  const items = normalizeData(rawItems);

  res.send(items);
};

const ITEMS = api({ get: getAllItems });

export default ITEMS;
