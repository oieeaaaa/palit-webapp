import {
  useState, useEffect, useContext, useCallback,
} from 'react';
import Link from 'next/link';
import useError from 'js/hooks/useError';
import UserContext from 'js/contexts/user';
import ITEM from 'js/models/item';
import { normalizeData } from 'js/utils';
import Layout from 'components/layout/layout';
import ItemCard, { ItemCardSkeleton } from 'components/itemCard/itemCard';

const Inventory = () => {
  const user = useContext(UserContext);
  const [items, setItems] = useState(null);
  const [displayError] = useError();
  const checkItemsEmpty = useCallback(() => !!(items && !items.length), [items]);

  /**
   * getItems.
   *
   * It should retrieve items of the user
   * It should display an error message when network request failed
   *
   * @param {string} userID
   */
  const getItems = async (userID) => {
    try {
      const rawData = await ITEM.getItemsAtUser(userID);
      const data = normalizeData(rawData);

      // if data is empty
      if (!data) return;

      // else
      setItems(data);
    } catch (err) {
      displayError(err);
    }
  };

  /**
   * useEffect.
   *
   * It should only trigger on initial render
   */
  useEffect(() => {
    if (!user.key) return;

    getItems(user.key);
  }, [user]); // TODO: Find a way to getItems without depending on the user every time

  return (
    <Layout title="Inventory">
      <div className="inventory">
        <div className="grid">
          <h1 className="inventory__title">Inventory</h1>
          <div className="inventory__list">
            {items ? items.map((item) => (
              <ItemCard
                key={item.key}
                item={item}
                linkOptions={{
                  href: '/trades/[itemID]',
                  as: `/trades/${item.key}`,
                }}
              />
            )) : (
              Array.from({ length: 6 }).map((_, index) => <ItemCardSkeleton key={index} />)
            )}
            {checkItemsEmpty() && (
              <div className="tip">
                <h2 className="tip-heading">Tip:</h2>
                <p className="tip-text">Add more item</p>
              </div>
            )}
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

export default Inventory;
