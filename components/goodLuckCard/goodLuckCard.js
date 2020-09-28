/*
***************************************
Component: GoodLuckCard
Author: Joimee
Description:
***************************************
*/
import Link from 'next/link';

const GoodLuckCard = ({ ownerID }) => (
  <div className="goodLuckCard">
    <h2 className="goodLuckCard__title">Best of luck!</h2>
    <p className="goodLuckCard__text">
      We&lsquo;ve sent an email to the traded Item&lsquo;s Owner.
    </p>
    <p className="goodLuckCard__text">
      But if you want to do it your way, See the contact info. of the  Owner
      and send them a message.
    </p>
    <Link href="/profile/[ownerID]" as={`/profile/${ownerID}`}>
      <a className="button --primary">
        Owner&lsquo;s profile
      </a>
    </Link>
  </div>
);

export default GoodLuckCard;
