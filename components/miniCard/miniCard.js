/*
***************************************
Component: MiniCard
Author: Joimee
Description:
***************************************
*/

export default ({ data }) => (
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
