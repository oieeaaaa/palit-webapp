import { createContext } from 'react';

export const defaultValue = {
  banner: {
    isOpen: false,
    text: 'Kamusta? 👋',
  },
  handlers: {
    showBanner: null,
  },
};

const LayoutContext = createContext(defaultValue);

export default LayoutContext;
