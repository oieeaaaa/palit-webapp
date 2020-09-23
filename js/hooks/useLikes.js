import { useContext } from 'react';
import UserContext from 'js/contexts/user';
import LIKES from 'js/models/likes';
import useError from 'js/hooks/useError';

/**
 * useLikes.
 */
const useLikes = () => {
  const user = useContext(UserContext);
  const [displayError] = useError();

  /**
   * setLike.
   *
   * It should add user's like from the selected item|payload
   *
   * @type {string} itemID
   * @type {function} onSuccess (callback function)
   */
  const setLike = async (payload, onSuccess) => {
    try {
      await LIKES.add(user.id, payload.key);

      onSuccess(payload);
    } catch (err) {
      displayError(err);
    }
  };

  /**
   * setUnlike.
   *
   * It should remove user's like from the specified itemID
   *
   * @type {string} itemID
   * @type {function} onSuccess (callback function)
   */
  const setUnlike = async (itemID, onSuccess) => {
    try {
      await LIKES.remove(user.id, itemID);

      onSuccess(itemID);
    } catch (err) {
      displayError(err);
    }
  };

  return {
    setLike,
    setUnlike,
  };
};

export default useLikes;
