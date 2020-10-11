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
  banner:
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
    if (bannerRef?.current && bannerContentRef?.current) {
      bannerRef.current.style.maxHeight = `${bannerContentRef.current.offsetHeight}px`;
    }

    // close banner after 3 seconds
    setTimeout(() => {
      handlers.closeBanner();

      if (bannerRef?.current) {
        bannerRef.current.style.maxHeight = 0;
      }
    }, 3000);
  }, [banner.isOpen, bannerRef, bannerContentRef]);

  /**
   * getBannerClass.
   */
  const getBannerClass = () => {
    const bannerClassList = [];

    if (banner.isOpen) {
      bannerClassList.push('open');
    }

    if (banner.variant) {
      bannerClassList.push(banner.variant);
    }

    return `banner --${bannerClassList.join(' --')}`;
  };

  return (
    <div className={getBannerClass()} ref={bannerRef}>
      <div className="grid" ref={bannerContentRef}>
        <div className="banner__content">
          <h3>{banner.text}</h3>
        </div>
      </div>
    </div>
  );
};

export default Banner;
