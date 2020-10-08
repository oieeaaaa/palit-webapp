/*
***************************************
Component: Banner
Author: Joimee
Description: For notifications, alerts, tips, and information of the user
***************************************
*/
import { useRef, useContext, useEffect } from 'react';
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
const Banner = () => {
  const { banner, handlers } = useContext(LayoutContext);
  const bannerRef = useRef(null);
  const bannerContentRef = useRef(null);

  useEffect(() => {
    if (!banner.isOpen) return;

    bannerRef.current.style.maxHeight = `${bannerContentRef.current.offsetHeight}px`;

    // close banner after 3 seconds
    setTimeout(() => {
      handlers.closeBanner();
      bannerRef.current.style.maxHeight = 0;
    }, 3000);
  }, [banner.isOpen]);

  return (
    <div className={`banner ${banner.isOpen ? '--open' : ''} --${banner.variant ? banner.variant : 'default'}`} ref={bannerRef}>
      <div className="banner__content" ref={bannerContentRef}>
        <h3>{banner.text}</h3>
      </div>
    </div>
  );
};

export default Banner;
