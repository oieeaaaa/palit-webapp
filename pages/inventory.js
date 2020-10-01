import {
  useState,
  useEffect,
  useContext,
  useCallback,
} from 'react';
import Link from 'next/link';
import useError from 'js/hooks/useError';
import UserContext from 'js/contexts/user';
import ITEM from 'js/models/item';
import useProtection from 'js/hooks/useProtection';
import useInfiniteScroll from 'js/hooks/useInfiniteScroll';
import { normalizeData } from 'js/utils';

import Layout from 'components/layout/layout';
import ItemCard, { ItemCardSkeleton } from 'components/itemCard/itemCard';

const Inventory = () => {
  // contexts
  const user = useContext(UserContext);

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

  /**
   * renderItems.
   */
  const renderItems = () => {
    const isItemsExists = !!items;

    if (isFetching || !isItemsExists) {
      return Array.from({ length: 6 }).map((_, index) => <ItemCardSkeleton key={index} />);
    }

    return items.map((item) => (
      <ItemCard
        key={item.key}
        item={item}
        linkOptions={{
          href: '/trades/[itemID]',
          as: `/trades/${item.key}`,
        }}
      />
    ));
  };

  /**
   * renderEmptyState
   */
  const renderEmptyState = () => isItemsEmpty() && (
    <div className="tip">
      <h2 className="tip-heading">Tip:</h2>
      <p className="tip-text">Add more item</p>
    </div>
  );

  return (
    <Layout title="Inventory">
      <div className="inventory">
        <div className="grid">
          <h1 className="inventory__title">Inventory</h1>
          <div className="inventory__list">
            {renderItems()}
            {renderEmptyState()}
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
