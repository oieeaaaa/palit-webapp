/*
***************************************
Component: Layout
Author: Joimee
Description:
***************************************
*/
import Head from 'next/head';
import Header from '../header/header';
import Footer, { FooterDock } from '../footer/footer';
import Banner from '../banner/banner';

const Layout = ({ title, description, children }) => (
  <>
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
    </Head>
    <Header />
    <Banner />
    {children}
    <Footer />
    <FooterDock />
  </>
);

Layout.defaultProps = {
  title: 'Palit',
  description: 'Palit Web App',
};

export default Layout;
