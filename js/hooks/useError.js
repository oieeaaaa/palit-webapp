import { useState, useContext } from 'react';
import LayouContext from 'js/contexts/layout';

/**
 * useError.
 *
 * It display an error message to the user
 */
const useError = () => {
  const [error, setError] = useState(null);
  const { handlers } = useContext(LayouContext);

  /**
   * displayError.
   *
   * It should display the error.message
   * @param {object} error
   */
  const displayError = (err) => {
    console.error(err.message);

    handlers.showBanner({
      text: error.message,
      variant: 'error',
    });

    setError(error);
  };

  return [
    displayError,
    error,
  ];
};

export default useError;
