import { useState, useEffect, useContext } from 'react';
import Link from 'next/link';
import UserContext from 'js/contexts/user';
import LayoutContext from 'js/contexts/layout';
import ITEM from 'js/models/item';
import { normalizeData } from 'js/utils';
import Layout from 'components/layout/layout';
import ItemCard from 'components/itemCard/itemCard';

export default () => {
  const user = useContext(UserContext);
  const { handlers } = useContext(LayoutContext);
  const [items, setItems] = useState([]);

  /**
   * getItems.
   *
   * It should retrieve items of the user
   * It should display an error message when network request failed
   */
  const getItems = async () => {
    try {
      const rawData = await ITEM.getItemsAtUser(user.id);
      const data = normalizeData(rawData);

      // if data is empty
      if (!data) return;

      // else
      setItems(data);
    } catch (err) {
      handlers.showBanner({
        text: err.message,
        variant: 'error',
      });
    }
  };

  /**
   * useEffect.
   *
   * It should only trigger on initial render
   */
  useEffect(() => {
    getItems();
  }, []);

  return (
    <Layout title="Inventory">
      <div className="inventory">
        <div className="grid">
          <h1 className="inventory__title">Inventory</h1>
          <div className="inventory__list">
            {items.map((item) => (
              <ItemCard key={item.key} item={item} />
            ))}
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
