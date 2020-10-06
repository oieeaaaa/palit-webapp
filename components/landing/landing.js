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

/**
 * LandingHeading.
 *
 * @param {object}
   * @param {string} title
 */
const LandingHeading = ({ title }) => (
  <h2 className="landing__heading">
    {title}
  </h2>
);

/**
 * LandingHeader.
 */
const LandingHeader = () => (
  <header className="landing-header">
    <h2 className="--brand">
      palit
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
  </header>
);

/**
 * LandingHero.
 */
const LandingHero = () => (
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
const LandingGuideListItem = ({ title, description, icon }) => (
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
const LandingGuide = () => (
  <div className="landing-guide">
    <LandingHeading title="Starter Guide" />
    <ul className="landing-guide-list">
      <LandingGuideListItem
        title="Request a trade"
        description="To initiate the trade you need to find items that are available for trade requests"
        icon="trade-request-outline"
      />
      <LandingGuideListItem
        title="Wait for the review"
        description="Your requested item&apos;s owner will review your request"
        icon="clock-outline"
      />
      <LandingGuideListItem
        title="Trade Accepted"
        description="Get in touch with the traded item&apos;s owner"
        icon="user-check-outline"
      />
    </ul>
  </div>
);

/**
 * LandingAction.
 */
const LandingAction = () => (
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
const LandingFooter = () => (
  <footer className="landing-footer">
    <FooterInfo />
  </footer>
);

/**
 * Landing.
 */
const Landing = () => (
  <div className="landing">
    <div className="grid">
      <LandingHeader />
      <LandingHero />
      <LandingGuide />
      <LandingAction />
    </div>
    <LandingFooter />
  </div>
);

export default Landing;
