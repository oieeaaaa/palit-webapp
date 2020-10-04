import 'scss/main.scss';
import 'palit-firebase';

import { useEffect } from 'react';
import { UserProvider } from 'js/contexts/user';
import { LayoutProvider } from 'js/contexts/layout';
import useAuth from 'js/hooks/useAuth';
import GridGuides from 'styleguide/grid-guide';

const App = ({ Component, pageProps }) => {
  const auth = useAuth();

  useEffect(() => {
    const unsubscribe = auth.verifyUser();

    return () => unsubscribe();
  }, []);

  return (
    <UserProvider>
      <LayoutProvider>
        <div className="app">
          <Component {...pageProps} />
          <GridGuides />
        </div>
      </LayoutProvider>
    </UserProvider>
  );
};

export default App;
