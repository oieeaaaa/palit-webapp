import Router from 'next/router';

/**
 * gotoHome
 */
export const gotoHome = () => Router.push('/', '/', { shallow: true });

/**
 * goBack.
 */
export const goBack = () => Router.back();

export default {
  gotoHome,
  goBack,
};
