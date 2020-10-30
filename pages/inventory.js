import {
  useState,
  useEffect,
  useContext,
  useCallback,
} from 'react';
import Link from 'next/link';
import useError from 'js/hooks/useError';
import AuthContext from 'js/contexts/auth';
import ITEM from 'js/models/item';
import useProtection from 'js/hooks/useProtection';
import useInfiniteScroll from 'js/hooks/useInfiniteScroll';
import { normalizeData } from 'js/utils';

import Layout from 'components/layout/layout';
import {
  InventoryItems,
  InventoryEmpty,
} from 'components/inventory/inventory';
import Title from 'components/title/title';

const Inventory = () => {
  // contexts
  const { user } = useContext(AuthContext);

  // states
  const [items, setItems] = useState(null);
  const [itemsStats, setItemsStats] = useState(null);

  // callbacks
  const isItemsEmpty = useCallback(() => !!(items && !items.length), [items]);

  // custom hooks
  const [displayError] = useError();
  const { isFetching } = useInfiniteScroll(getItems, itemsStats?.totalItems);

  /**
   * getItemsStats
   */
  const getItemsStats = async () => {
    try {
      const rawItemsStats = await ITEM.getItemsStats();

      setItemsStats(rawItemsStats.data());
    } catch (err) {
      displayError(err);
    }
  };

  /**
   * getItems.
   *
   * It should retrieve items of the user
   * It should display an error message when network request failed
   *
   * @param {string} userID
   */
  async function getItems(limit) {
    if (isFetching) return;

    try {
      const userKey = user.key;

      const rawData = await ITEM.getItemsAtUser(userKey, limit);
      const data = normalizeData(rawData);

      // if data is empty
      if (!data) return;

      // else
      setItems(data);
    } catch (err) {
      displayError(err);
    }
  }

  /**
   * useEffect.
   */
  useEffect(() => {
    const isNotInitalized = !items && !itemsStats;

    if (isNotInitalized) {
      getItems();
      getItemsStats();
    }
  }, []);

  return (
    <Layout title="Inventory">
      <div className="inventory">
        <div className="grid">
          <Title>Inventory</Title>
          <div className="inventory__list">
            <InventoryItems items={items} isFetching={isFetching} />
            <InventoryEmpty isEmpty={isItemsEmpty()} />
          </div>
          <Link href="/items/add">
            <a className="button --default inventory__add">
              Add item
            </a>
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default useProtection(Inventory);
