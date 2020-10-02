/*
***************************************
Component: Inventory
Author: Joimee
Description:
***************************************
*/
import ItemCard, { ItemCardSkeleton } from 'components/itemCard/itemCard';

/**
 * InventoryItems.
 *
 * @param {object}
   * @param {boolean} isFetching
   * @param {object} items
 */
export const InventoryItems = ({ isFetching, items }) => {
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
 * InventoryEmpty.
 *
 * @param {object}
   * @param {boolean} isEmpty
 */
export const InventoryEmpty = ({ isEmpty }) => isEmpty && (
  <div className="tip">
    <h2 className="tip-heading">Tip:</h2>
    <p className="tip-text">Add more item</p>
  </div>
);

export default {
  InventoryItems,
  InventoryEmpty,
};
