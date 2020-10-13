import Router from 'next/router';

/**
 * gotoHome
 */
export const gotoHome = () => Router.push('/', '/', { shallow: true });

export default {
  gotoHome,
};
