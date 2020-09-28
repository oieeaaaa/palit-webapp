import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { ReactSVG } from 'react-svg';
import USER from 'js/models/user';
import useError from 'js/hooks/useError';
import { normalizeData } from 'js/utils';
import Layout from 'components/layout/layout';

const Owner = () => {
  const [displayError] = useError();
  const router = useRouter();
  const [owner, setOwner] = useState({});

  /**
   * getOwner
   *
   * @param {string} ownerID
   */
  const getOwner = async (ownerID) => {
    try {
      const rawOwner = await USER.getOne(ownerID);

      setOwner(normalizeData(rawOwner));
    } catch (err) {
      displayError(err);
    }
  };

  /**
   * useEffect.
   */
  useEffect(() => {
    const { ownerID } = router.query;

    if (!ownerID) return;

    getOwner(ownerID);
  }, [router]);

  return (
    <Layout title="Owner's Profile">
      <div className="owner grid">
        <div className="owner-top">
          <div className="owner__avatar-container">
            <figure className="owner__avatar">
              {owner.avatar ? (
                <img src={owner.avatar} alt={owner.firstName} />
              ) : (
                <ReactSVG
                  className="owner__avatar-icon"
                  src="/icons/image-outline.svg"
                />
              )}
            </figure>
          </div>
          <div className="owner__name">
            <div className="owner-group">
              <span className="owner-group__label">First Name</span>
              <span className="owner-group__text">{owner.firstName}</span>
            </div>
            <div className="owner-group">
              <span className="owner-group__label">Last Name</span>
              <span className="owner-group__text">{owner.lastName}</span>
            </div>
          </div>
        </div>
        <div className="owner-group">
          <span className="owner-group__label">Email</span>
          <a
            className="owner-group__link"
            href={`mailto:${owner.email}`}
            target="_blank"
            rel="noreferrer"
          >
            {owner.email}
          </a>
        </div>
        <div className="owner-group">
          <span className="owner-group__label">Phone Number</span>
          <a
            className="owner-group__link"
            href={`tel:${owner.phoneNumber}`}
            target="_blank"
            rel="noreferrer"
          >
            {owner.phoneNumber}
          </a>
        </div>
        <div className="owner-group">
          <span className="owner-group__label">Messenger Link</span>
          <a
            className="owner-group__link"
            href={`https://m.me/${owner.messengerLink}`}
            target="_blank"
            rel="noreferrer"
          >
            {owner.messengerLink}
          </a>
        </div>
        <div className="owner-group">
          <span className="owner-group__label">Address</span>
          <p className="owner-group__longtext">
            {owner.address}
          </p>
        </div>
        <button
          className="button --default"
          type="button"
          onClick={() => router.back()}
        >
          Go back
        </button>
      </div>
    </Layout>
  );
};

export default Owner;
