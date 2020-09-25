/*
***************************************
Component: MiniCard
Author: Joimee
Description:
***************************************
*/

export const MiniCardSkeleton = ({ className = '' }) => (
  <div className={`miniCard-skeleton ${className}`}>
    <div className="miniCard-skeleton-image" />
    <div className="miniCard-skeleton-info">
      <span className="miniCard-skeleton-name" />
      <span className="miniCard-skeleton-likes" />
    </div>
  </div>
);

/**
 * @param {object} data:
   *  @param {string} name
   *  @param {number} likes
   *  @param {string} cover
 */
const MiniCard = ({ data }) => (
  <div className="miniCard">
    <figure className="miniCard-image">
      <img src={data.cover} alt={data.name} />
    </figure>
    <div className="miniCard-info">
      <h3 className="miniCard-name">{data.name}</h3>
      <p className="miniCard-likes">
        Likes:
        {' '}
        <b>{data.likes}</b>
      </p>
    </div>
  </div>
);

export default MiniCard;
