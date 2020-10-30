/*
***************************************
Component: Avatar
Author: Joimee
Description:
***************************************
*/

/**
 * Avatar.
 *
 * @param {object} props
   * @param {string} className
   * @param {string} variant
   * @param {string} src
   * @param {string} name
 */
const Avatar = ({
  className = '',
  initial,
  src,
  name,
}) => (
  <div className={`avatar ${className}`}>
    {src ? (
      <img
        className="avatar__image"
        src={src}
        alt={name}
      />
    ) : (
      <span className="avatar__placeholder">{initial}</span>
    )}
  </div>
);

export default Avatar;
