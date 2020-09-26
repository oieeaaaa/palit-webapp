import { useState, createContext } from 'react';

export const defaultValue = {
  banner: {
    isOpen: false,
    text: 'Kamusta? 👋',
  },
  handlers: {
    showBanner: null,
  },
};

// context
const LayoutContext = createContext(defaultValue);

/**
 * LayoutProvider.
 *
 * @param {object} props
   * @param {object} children
 */
export const LayoutProvider = ({ children }) => {
  const [banner, setBanner] = useState(defaultValue.banner);
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
    <LayoutContext.Provider value={layoutContextValue}>
      {children}
    </LayoutContext.Provider>
  );
};

export default LayoutContext;
