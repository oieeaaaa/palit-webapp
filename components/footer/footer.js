/*
***************************************
Component: Footer
Author: Joimee
Description:
***************************************
*/
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ReactSVG } from 'react-svg';
import routes, { footerInfo } from 'js/routes';

export const FooterDock = () => <div className="footer-dock" />;

export const FooterNav = () => {
  const router = useRouter();

  return (
    <div className="grid footer-nav">
      {routes.map((route) => (
        <Link href={route.href} key={route.name}>
          <a className={
            `footer-nav__link --${route.name} ${route.href === router.pathname ? '--active' : ''}`
          }
          >
            <ReactSVG className="footer-nav__link-icon" src={`/icons/${route.icon}.svg`} />
          </a>
        </Link>
      ))}
    </div>
  );
};

export const FooterInfo = () => (
  <div className="grid footer-info">
    {footerInfo.map((footerInfoItem) => (
      <Link href={footerInfoItem.href} key={footerInfoItem.name}>
        <a className="footer-info__link">
          {footerInfoItem.name}
        </a>
      </Link>
    ))}
  </div>
);

const Footer = () => (
  <>
    <div className="footer-spacer" />
    <div className="footer">
      <FooterNav />
      <FooterInfo />
    </div>
  </>
);

export default Footer;
