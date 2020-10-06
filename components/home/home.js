/*
***************************************
Component: Home
Author: Joimee
Description:
***************************************
*/
import ItemCard, { ItemCardSkeleton } from 'components/itemCard/itemCard';

/**
 * HomeItems.
 *
 * @param {boolean} isFetching
 * @param {boolean} isLiking
 * @param {object} items
 * @param {function} onLike
 */
export const HomeItems = ({
  isFetching,
  items,
  onLike,
  isLiking,
}) => {
  const isItemsExists = !!items;

  if (isFetching || !isItemsExists) {
    return Array.from({ length: 10 }).map((_, index) => <ItemCardSkeleton key={index} />);
  }

  return items.map((item) => (
    <ItemCard
      key={item.key}
      item={item}
      onLike={onLike}
      isLiking={isLiking}
      isIndicatorOn={false}
      linkOptions={{
        href: '/items/[itemID]',
        as: `/items/${item.key}`,
      }}
    />
  ));
};

/**
 * HomeItemsEmpty.
 *
 * @param {boolean} isEmpty
 */
export const HomeItemsEmpty = ({ isEmpty }) => isEmpty && (
  <div className="tip">
    <h1 className="tip-heading">
      Oops!
    </h1>
    <p className="tip-text">
      It&apos;s empty.
    </p>
  </div>
);

export default {
  HomeItems,
  HomeItemsEmpty,
};
