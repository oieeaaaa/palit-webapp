import 'scss/main.scss';
import 'palit-firebase';

import { LayoutProvider } from 'js/contexts/layout';
import { AuthProvider } from 'js/contexts/auth';
import GridGuides from 'styleguide/grid-guide';

const App = ({ Component, pageProps }) => (
  <AuthProvider>
    <LayoutProvider>
      <div className="app">
        <Component {...pageProps} />
        <GridGuides />
      </div>
    </LayoutProvider>
  </AuthProvider>
);

export default App;
