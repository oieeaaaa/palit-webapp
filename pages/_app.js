import { useState } from 'react';
import 'scss/main.scss';
import GridGuides from 'styleguide/grid-guide';
import UserContext, { defaultValue as userDefaultValue } from 'js/contexts/user';
import LayoutContext, { defaultValue as layoutDefaultValue } from 'js/contexts/layout';

export default ({ Component, pageProps }) => {
  const [banner, setBanner] = useState(layoutDefaultValue.banner);

  const layoutContextValue = {
    banner,
    handlers: {
      showBanner: (data) => setBanner((prevState) => ({
        ...prevState,
        ...data,
        isOpen: true,
      })),
      closeBanner: () => setBanner({ isOpen: false }),
    },
  };

  return (
    <UserContext.Provider value={userDefaultValue}>
      <LayoutContext.Provider value={layoutContextValue}>
        <div>
          <Component {...pageProps} />
          <GridGuides />
        </div>
      </LayoutContext.Provider>
    </UserContext.Provider>
  );
};
