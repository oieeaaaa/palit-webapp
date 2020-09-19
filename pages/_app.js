import 'scss/main.scss';
import GridGuides from 'styleguide/grid-guide';
import UserContext, { defaultValue as userDefaultValue } from 'js/contexts/user';

export default ({ Component, pageProps }) => (
  <UserContext.Provider value={userDefaultValue}>
    <div>
      <Component {...pageProps} />
      <GridGuides />
    </div>
  </UserContext.Provider>
);
