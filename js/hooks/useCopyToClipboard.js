import { useContext } from 'react';
import LayoutContext from 'js/contexts/layout';

/**
 * useCopyToClibpard.
 *
 * @param {object} element
 */
const useCopyToClibpard = (element) => {
  const { handlers } = useContext(LayoutContext);

  /**
   * copyToClipboard.
   */
  const copyToClipboard = () => {
    if (!element?.current) return;

    const messageBoxEl = element.current;
    const range = document.createRange();

    // 1. cleanup
    messageBoxEl.focus();
    window.getSelection().removeAllRanges();

    // 2. create a selection
    range.setStartBefore(messageBoxEl.firstChild);
    range.setEndAfter(messageBoxEl.lastChild);
    window.getSelection().addRange(range);

    /* 3. Copy the text inside the text field */
    document.execCommand('copy');

    // 4. deselect, so the browser doesn't leave the element visibly selected
    window.getSelection().removeAllRanges();

    // 5. Let the user know the text is copied
    handlers.showBanner({
      text: 'Copied text ✨',
      variant: 'info',
    });
  };

  return copyToClipboard;
};

export default useCopyToClibpard;
