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
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import useAuth from 'js/hooks/useAuth';
import routes from 'js/routes';

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
  avatar,
  isDropdownOpen,
  openDropdown,
  signout,
}) => (
  avatar && (
  <div className="header-avatar">
    <button className="header__profile" type="button" onClick={openDropdown}>
      <img src={avatar} alt="Joimee Tan Cajandab" />
    </button>
    <HeaderDropdown isOpen={isDropdownOpen} onLogout={signout} />
  </div>
  )
);

/**
 * HeaderWithAvatar.
 *
 * @param {object}
   * @param {object} user
   * @param {function} openDropdown
   * @param {boolean} isDropdownOpen
   * @param {function} signout
 */
const HeaderWithoutAvatar = ({
  user,
  openDropdown,
  isDropdownOpen,
  signout,
}) => (!user.avatar && user.email) && (
  <div className="header-avatar">
    <button className="header__profile" type="button" onClick={openDropdown}>
      <span className="header__placeholder">{user.email[0]}</span>
    </button>
    <HeaderDropdown isOpen={isDropdownOpen} onLogout={signout} />
  </div>
);

/**
 * Header.
 *
 * @param {object} props
   * @param {object} user
 */
const Header = ({ user }) => {
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

  return (
    <div className="header">
      <div className="grid">
        <a className="header__brand" href="/">
          Palit
        </a>
        <HeaderWithAvatar
          avatar={user.avatar}
          isDropdownOpen={isDropdownOpen}
          openDropdown={openDropdown}
          signout={auth.signout}
        />
        <HeaderWithoutAvatar
          user={user}
          openDropdown={openDropdown}
          isDropdownOpen={isDropdownOpen}
          signout={auth.signout}
        />
        <HeaderNav currentPath={router.pathname} />
      </div>
    </div>
  );
};

export default Header;
