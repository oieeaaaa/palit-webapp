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
   * @type {object} payload
   */
  const setLike = async (payload) => {
    try {
      await LIKES.add(user.key, payload.key);

      return payload;
    } catch (err) {
      displayError(err);

      return err;
    }
  };

  /**
   * setUnlike.
   *
   * It should remove user's like from the specified itemID
   *
   * @type {string} itemID
   */
  const setUnlike = async (itemID) => {
    try {
      await LIKES.remove(user.key, itemID);

      return itemID;
    } catch (err) {
      displayError(err);

      return err;
    }
  };

  return {
    setLike,
    setUnlike,
  };
};

export default useLikes;
