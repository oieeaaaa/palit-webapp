/*
***************************************
Component: Header
Author: Joimee
Description:
***************************************
*/
import Link from 'next/link';

/**
 * Header.
 *
 * @param {object} props
   * @param {object} user
 */
const Header = ({ user }) => (
  <div className="header">
    <div className="grid">
      <a className="header__brand" href="/">
        Palit
      </a>

      {user.avatar && (
        <Link href="/profile">
          <a className="header__profile">
            <img src="/temp/profile.png" alt="Joimee Tan Cajandab" />
          </a>
        </Link>
      )}

      {(!user.avatar && user.email) && (
        <Link href="/profile">
          <a className="header__profile">
            <span className="header__placeholder">{user.email[0]}</span>
          </a>
        </Link>
      )}
    </div>
  </div>
);

export default Header;
