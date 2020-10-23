import firebase from 'palit-firebase';
import { normalizeData } from 'js/utils';

const db = firebase.firestore();

// collections
const itemsCollection = db.collection('items');
const usersCollection = db.collection('users');

// October 22, 2020
const migrateItem = async () => {
  const rawItems = await itemsCollection.get();

  db.runTransaction(async (transaction) => {
    const newItems = [];

    for (const itemDoc of rawItems.docs) {
      const item = normalizeData(itemDoc);
      if (item.key !== '--stats--') {
        const rawOwnerInfo = await transaction.get(usersCollection.doc(item.owner));
        const ownerInfo = normalizeData(rawOwnerInfo);

        newItems.push({
          ...item,
          ownerInfo: {
            name: ownerInfo.firstName,
            address: ownerInfo.address,
          },
        });
      }
    }

    for (const { key, ...newItem } of newItems) {
      await transaction.update(itemsCollection.doc(key), newItem);
    }
  });
};

export default migrateItem;
