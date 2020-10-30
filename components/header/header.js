/*
eslint
  jsx-a11y/no-noninteractive-element-interactions: 0,
  jsx-a11y/click-events-have-key-events: 0
*/

/*
***************************************
Component: Header
Author: Joimee
Description:
***************************************
*
*/
import { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

// contexts
import AuthContext from 'js/contexts/auth';

// hooks
import useAuth from 'js/hooks/useAuth';

// routes
import routes from 'js/routes';

// components
import Banner from 'components/banner/banner';
import { LandingHeader } from 'components/landing/landing';
import Avatar from 'components/avatar/avatar';

/**
 * HeaderDropdown.
 *
 * @param {object} props
   * @param {boolean} isOpen
   * @param {function} onLogout
 */
const HeaderDropdown = ({ isOpen, onLogout }) => (
  <ul
    className={`header-dropdown ${isOpen ? '--open' : ''}`}
    onClick={(e) => e.stopPropagation()} // hide from window click event
  >
    <li className="header-dropdown__item">
      <Link href="/profile">
        <a className="header-dropdown__link">
          Profile
        </a>
      </Link>
    </li>
    <li className="header-dropdown__item">
      <button
        className="header-dropdown__button --logout"
        type="button"
        onClick={onLogout}
      >
        Logout
      </button>
    </li>
  </ul>
);

/**
 * HeaderNav.
 *
 * @param {object}
   * @param {string} currentPath
 */
const HeaderNav = ({ currentPath }) => (
  <div className="header-nav">
    {routes.map((route) => (
      <Link href={route.href} key={route.name}>
        <a className={
          `header-nav__item ${currentPath === route.href ? '--active' : ''}`
        }
        >
          {route.name}
        </a>
      </Link>
    ))}
  </div>
);

/**
 * HeaderWithAvatar.
 *
 * @param {object}
   * @param {string} avatar
   * @param {boolean} isDropdownOpen
   * @param {function} openDropdown
   * @param {function} signout
 */
const HeaderWithAvatar = ({
  name,
  initial,
  avatar,
  isDropdownOpen,
  openDropdown,
  signout,
}) => (
  <div className="header-avatar">
    <button className="header__profile" type="button" onClick={openDropdown}>
      <Avatar
        className="header__profile-avatar"
        name={name}
        initial={initial}
        src={avatar}
      />
    </button>
    <HeaderDropdown isOpen={isDropdownOpen} onLogout={signout} />
  </div>
);

/**
 * Header.
 *
 */
const Header = () => {
  // contexts
  const { user } = useContext(AuthContext);

  // states
  const [isDropdownOpen, setIsDropdownOpen] = useState();

  // custom hooks
  const auth = useAuth();
  const router = useRouter();

  /**
   * openDropdown.
   *
   * @param {object} e
   */
  const openDropdown = (e) => {
    e.preventDefault();
    e.stopPropagation();

    setIsDropdownOpen(!isDropdownOpen);
  };

  useEffect(() => {
    const closeDropdown = () => {
      setIsDropdownOpen(false);
    };

    window.addEventListener('click', closeDropdown);

    return () => {
      window.removeEventListener('click', closeDropdown);
    };
  }, []);

  if (!user.key) {
    return <LandingHeader />;
  }

  return (
    <header className="header">
      <div className="grid">
        <Link href="/">
          <a className="header__brand">
            Palit
          </a>
        </Link>
        <HeaderWithAvatar
          avatar={user.avatar}
          initial={user.email[0]}
          name={user.firstName}
          isDropdownOpen={isDropdownOpen}
          openDropdown={openDropdown}
          signout={auth.signout}
        />
        {user.key && <HeaderNav currentPath={router.pathname} />}
      </div>
      <Banner />
    </header>
  );
};

export default Header;
