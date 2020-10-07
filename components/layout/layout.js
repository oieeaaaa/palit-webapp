/*
***************************************
Component: Layout
Author: Joimee
Description:
***************************************
*/
import { useContext } from 'react';
import Head from 'next/head';
import AuthContext from 'js/contexts/auth';
import Header from '../header/header';
import Footer, { FooterDock } from '../footer/footer';
import Banner from '../banner/banner';

const Layout = ({ title, description, children }) => {
  const { user } = useContext(AuthContext);

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
      </Head>
      <Header user={user} />
      <Banner />
      {children}
      <Footer />
      <FooterDock />
    </>
  );
};

Layout.defaultProps = {
  title: 'Palit',
  description: 'Palit Web App',
};

export default Layout;
