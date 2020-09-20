/*
***************************************
Component: Footer
Author: Joimee
Description:
***************************************
*/
import { ReactSVG } from 'react-svg';

export const FooterDock = () => <div className="footer-dock" />;

export default () => (
  <div className="footer">
    <div className="grid">
      <a className="footer__link --home" href="/">
        <ReactSVG className="footer__link-icon" src="/icons/home-outline.svg" />
      </a>
      <a className="footer__link --trades" href="/">
        <ReactSVG className="footer__link-icon" src="/icons/clipboard-outline.svg" />
      </a>
      <a className="footer__link --search" href="/">
        <ReactSVG className="footer__link-icon" src="/icons/search-outline.svg" />
      </a>
    </div>
  </div>
);
