import { useContext } from 'react';
import LayouContext from 'js/contexts/layout';

/**
 * useError.
 *
 * It display an error message to the user
 */
const useError = () => {
  const { handlers } = useContext(LayouContext);

  /**
   * displayError.
   *
   * It should display the error.message
   * @param {object} error
   */
  const displayError = (error) => {
    handlers.showBanner({
      text: error.message,
      variant: 'error',
    });
  };

  return [
    displayError,
  ];
};

export default useError;
