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
import Link from 'next/link';
import useAuth from 'js/hooks/useAuth';

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
 * Header.
 *
 * @param {object} props
   * @param {object} user
 */
const Header = ({ user }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState();
  const auth = useAuth();

  /**
   * openDropdown.
   *
   * @param {object} e
   */
  const openDropdown = (e) => {
    e.preventDefault();
    e.stopPropagation();

    setIsDropdownOpen(true);
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

        {user.avatar && (
          <div className="header-nav">
            <button className="header__profile" type="button" onClick={openDropdown}>
              <img src={user.avatar} alt="Joimee Tan Cajandab" />
            </button>
            <HeaderDropdown isOpen={isDropdownOpen} onLogout={auth.signout} />
          </div>
        )}

        {(!user.avatar && user.email) && (
          <div className="header-nav">
            <button className="header__profile" type="button" onClick={openDropdown}>
              <span className="header__placeholder">{user.email[0]}</span>
            </button>
            <HeaderDropdown isOpen={isDropdownOpen} onLogout={auth.signout} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
