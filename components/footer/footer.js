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

export const FooterDock = () => <div className="footer-dock" />;

export const footerNav = [
  {
    name: 'home',
    href: '/',
    icon: 'home-outline',
  },
  {
    name: 'inventory',
    href: '/inventory',
    icon: 'clipboard-outline',
  },
  {
    name: 'search',
    href: '/search',
    icon: 'search-outline',
  },
];

const Footer = () => {
  const router = useRouter();

  return (
    <div className="footer">
      <div className="grid">
        {footerNav.map((footerNavItem) => (
          <Link href={footerNavItem.href} key={footerNavItem.name}>
            <a className={
              `footer__link --${footerNavItem.name} ${footerNavItem.href === router.pathname ? '--active' : ''}`
            }
            >
              <ReactSVG className="footer__link-icon" src={`/icons/${footerNavItem.icon}.svg`} />
            </a>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Footer;
