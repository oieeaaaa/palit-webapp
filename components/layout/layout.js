/*
***************************************
Component: Layout
Author: Joimee
Description:
***************************************
*/
import { useState } from 'react';
import Head from 'next/head';
import LayoutContext, { defaultValue } from 'js/contexts/layout';
import Header from '../header/header';
import Footer from '../footer/footer';
import Banner from '../banner/banner';

const Layout = ({ title, description, children }) => {
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
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
      </Head>
      <Header />
      <Banner />
      {children}
      <Footer />
    </LayoutContext.Provider>
  );
};

Layout.defaultProps = {
  title: 'Palit',
  description: 'Palit Web App',
};

export default Layout;
