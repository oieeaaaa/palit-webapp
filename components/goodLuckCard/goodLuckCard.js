/*
***************************************
Component: GoodLuckCard
Author: Joimee
Description:
***************************************
*/
import Link from 'next/link';

/**
 * GoodLuckCard.
 *
 * @param {object}
   * @param {string} ownerID
 */
const GoodLuckCard = ({ ownerID }) => (
  <div className="goodLuckCard">
    <h2 className="goodLuckCard__title">
      Yay! Your item is traded, Congrats!
      <span role="img" aria-label="Yehey!"> 🎉</span>
    </h2>
    <p className="goodLuckCard__text">
      We&lsquo;ve sent an email to the owner of the Accepted Item.
    </p>
    <p className="goodLuckCard__text">
      For now this is as far as our service can help you trade your item the
      rest is up to you to figure out how are you going to make the trade
      happen in real life.
    </p>
    <p className="goodLuckCard__text">
      Please checkout the Owner&apos;s profile to get some more information about the
      owner of the accepted item.
    </p>
    <p className="goodLuckCard__text">
      Be NICE. We wish you the best!
    </p>
    <Link href="/profile/[ownerID]" as={`/profile/${ownerID}`}>
      <a className="button --primary">
        Owner&lsquo;s profile
      </a>
    </Link>
  </div>
);

export default GoodLuckCard;
