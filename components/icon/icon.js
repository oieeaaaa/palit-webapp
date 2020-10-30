/*
***************************************
Component: Icon
Author: Joimee
Description:
***************************************
*/
import { ReactSVG } from 'react-svg';

/**
 * Icon.
 *
 * @param {object} props
   * @param {string} name
 */
const Icon = ({ className = '', name }) => (
  <ReactSVG
    className={`icon ${className}`}
    src={`/icons/${name}.svg`}
  />
);

export default Icon;
