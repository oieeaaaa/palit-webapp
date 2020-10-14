import { useContext } from 'react';
import AuthContext from 'js/contexts/auth';
import Link from 'next/link';
import { LandingFooter } from 'components/landing/landing';
import Header from 'components/header/header';

const About = () => {
  const { isVerified } = useContext(AuthContext);

  return (
    <div className="about">
      <Header />
      <div className="grid">
        <figure className="about__image">
          <img src="/images/palit.png" alt="Palit" />
        </figure>
        <h1 className="about__heading">What is palit?</h1>
        <div className="about__content">
          <p className="about__text">
            Palit is a trading platform for people who need to trade items.
            {' '}
            {!isVerified && (
              <Link href="/signup">
                <a className="about__link">It&apos;s not rocket surgery!</a>
              </Link>
            )}
          </p>
          <form
            className="about__donate"
            action="https://www.paypal.com/cgi-bin/webscr"
            method="post"
            target="_top"
          >
            <input type="hidden" name="cmd" value="_s-xclick" />
            <input type="hidden" name="hosted_button_id" value="CSAUGRJNW949A" />
            <button
              name="submit"
              className="button --primary"
              type="submit"
              title="PayPal - The safer, easier way to pay online!"
            >
              Send us some love
            </button>
          </form>
        </div>
      </div>
      <LandingFooter />
    </div>
  );
};

export default About;
