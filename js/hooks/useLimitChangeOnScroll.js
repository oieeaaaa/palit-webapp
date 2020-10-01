import { useState, useEffect, useCallback } from 'react';
import throttle from 'lodash.throttle';

/**
 * useLimitChangeOnScroll.
 *
 * A checker if the user hits the bottom part of the page
 * If yes, Increase the limit by the value of 'toIncrement' which has a default value of 8
 *
 * @param {number} defaultLimit
 * @param {number} toIncrement
 * @param {number} triggerOffset
 *
 * @return {number} limit
 */
const useLimitChangeOnScroll = (defaultLimit, toIncrement = 8, triggerOffset = 0) => {
  // states
  const [limit, setLimit] = useState(defaultLimit || 0);

  // callbacks
  const handleBottomChecker = useCallback(throttle(() => {
    const scrolled = (window.scrollY + window.innerHeight) + triggerOffset;
    const bodyHeight = document.body.offsetHeight;
    const isAtTheBottom = scrolled >= bodyHeight;

    if (isAtTheBottom) {
      setLimit((prevLimit) => prevLimit + toIncrement);
    }
  }, 300), [setLimit]);

  /**
   * destroyLimitListeners.
   */
  const destroyLimitListeners = () => {
    window.removeEventListener('scroll', handleBottomChecker);
  };

  /**
   * useEffect.
   */
  useEffect(() => {
    window.addEventListener('scroll', handleBottomChecker);

    return destroyLimitListeners;
  }, []);

  return [limit, destroyLimitListeners];
};

export default useLimitChangeOnScroll;
