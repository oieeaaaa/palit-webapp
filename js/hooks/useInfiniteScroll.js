import { useState, useEffect } from 'react';
import useLimitChangeOnScroll from 'js/hooks/useLimitChangeOnScroll';

/**
 * useInfiniteScroll.
 *
 * @param {function} callback (must be a promise)
 * @param {number} total
 * @param {number} itemsLimit
 */
const useInfiniteScroll = (callback, total, itemsLimit = 0) => {
  const [limit, destroyLimitListeners] = useLimitChangeOnScroll(itemsLimit);
  const [isFetching, setIsFetching] = useState(false);

  /**
   * reFetch
   */
  const reFetch = async () => {
    if (!total) return;

    const isTotalReached = limit >= total;

    try {
      if (isTotalReached) {
        await callback(limit);
        destroyLimitListeners();
        return;
      }

      setIsFetching(true);

      await callback(limit);
    } catch (err) {
      console.error(err);
    } finally {
      setIsFetching(false);
    }
  };

  /**
   * useEffect.
   */
  useEffect(() => {
    reFetch();
  }, [limit, total]);

  return { isFetching, limit };
};

export default useInfiniteScroll;
