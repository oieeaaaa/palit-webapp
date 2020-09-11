import 'scss/main.scss';
import GridGuides from 'styleguide/grid-guide';

export default ({ Component, pageProps }) => (
  <div>
    <Component {...pageProps} />
    <GridGuides />
  </div>
);
