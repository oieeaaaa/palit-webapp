import { db, fn } from 'admin';
import { normalizeData } from 'js/utils';

const itemsCollection = db.collection('items');

const get = fn.https.onRequest(async (req, res) => {
  const { userID, limit } = req.body;

  const rawItems = await itemsCollection
    .where('owner', '!=', userID)
    .where('isTraded', '==', false)
    .limit(parseInt(limit, 10) || 10)
    .get();

  const items = normalizeData(rawItems);

  res.send(items);
});

const ITEMS = async (req, res) => {
  switch (req.method) {
    case 'GET':
      await get(req, res);
      break;

    default:
      throw new Error('Unsupported method!');
  }
};

export default ITEMS;
