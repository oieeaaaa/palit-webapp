/*
***************************************
Component: Landing
Author: Joimee
Description:
***************************************
*/
import Link from 'next/link';
import { ReactSVG } from 'react-svg';

import { FooterInfo } from 'components/footer/footer';
import Banner from 'components/banner/banner';

/**
 * LandingHeading.
 *
 * @param {object}
   * @param {string} title
 */
export const LandingHeading = ({ title }) => (
  <h2 className="landing__heading">
    {title}
  </h2>
);

/**
 * LandingHeader.
 */
export const LandingHeader = () => (
  <header className="grid">
    <div className="landing-header">
      <h2 className="landing-header__brand --brand">
        <Link href="/">
          <a>
            palit
          </a>
        </Link>
      </h2>
      <div className="landing-header-buttons">
        <Link href="/signup">
          <a className="landing-header__button --signup" type="button">
            Signup
          </a>
        </Link>
        <Link href="/login">
          <a className="landing-header__button">
            Login
          </a>
        </Link>
      </div>
    </div>
    <Banner />
  </header>
);

/**
 * LandingHero.
 */
export const LandingHero = () => (
  <div className="landing-hero">
    <h1 className="landing-hero__title">
      Save your money
      <span className="landing-hero__title-text">
        by
        {' '}
        <span className="--emphasize">
          trading items
        </span>
      </span>
    </h1>
    <ReactSVG
      className="landing-hero__image"
      src="/icons/lady-shopping.svg"
    />
  </div>
);

/**
 * LandingGuideListItem.
 *
 * @param {object}
   * @param {string} title
   * @param {string} description
   * @param {string} icon
 */
export const LandingGuideListItem = ({ title, description, icon }) => (
  <li className="landing-guide-list__item">
    <ReactSVG
      className="landing-guide-list__item-icon"
      src={`/icons/${icon}.svg`}
    />
    <h3 className="landing-guide-list__item-title">
      {title}
    </h3>
    <p className="landing-guide-list__item-text">
      {description}
    </p>
  </li>
);

/**
 * LandingGuide.
 */
export const LandingGuide = () => (
  <div className="landing-guide">
    <LandingHeading title="Trading Process" />
    <ul className="landing-guide-list">
      <LandingGuideListItem
        title="Request a trade"
        description="Find the items that you like or need then click the Trade Request button"
        icon="trade-request-outline"
      />
      <LandingGuideListItem
        title="Keep Trading"
        description="The more you trade the more chances there will be to get your item accepted"
        icon="clock-outline"
      />
      <LandingGuideListItem
        title="Trade Accepted"
        description="Congrats! Now you should see the note about what's next..."
        icon="user-check-outline"
      />
    </ul>
  </div>
);

/**
 * LandingAction.
 */
export const LandingAction = () => (
  <div className="landing-action">
    <LandingHeading title="Get Started" />
    <div className="landing-action-items">
      <Link href="/signup">
        <a className="button --primary landing-action__login">
          Give it a try
        </a>
      </Link>
      <Link href="/login">
        <a className="link">
          I already have an account
        </a>
      </Link>
    </div>
  </div>
);

/**
 * LandingFooter.
 */
export const LandingFooter = () => (
  <footer className="landing-footer">
    <FooterInfo />
  </footer>
);

/**
 * Landing.
 */
const Landing = () => (
  <div className="landing">
    <LandingHeader />
    <div className="grid">
      <LandingHero />
      <LandingGuide />
      <LandingAction />
    </div>
    <LandingFooter />
  </div>
);

export default Landing;
