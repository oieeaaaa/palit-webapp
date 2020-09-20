/*
***************************************
Component: Banner
Author: Joimee
Description: For notifications, alerts, tips, and information of the user
***************************************
*/
import { useContext, useEffect } from 'react';
import LayoutContext from 'js/contexts/layout';

/*
  PROPS:
    isOpen {bool}
    text {string}
    variant {string}
     default
     warning
     error
     info
     success
*/

export default () => {
  const { banner, handlers } = useContext(LayoutContext);

  useEffect(() => {
    if (!banner.isOpen) return;

    // close banner after 3 seconds
    setTimeout(() => {
      handlers.closeBanner();
    }, 3000);
  }, [banner.isOpen]);

  return (
    <div className={`banner ${banner.isOpen ? '--open' : ''} --${banner.variant ? banner.variant : 'default'}`}>
      <h3>{banner.text}</h3>
    </div>
  );
};