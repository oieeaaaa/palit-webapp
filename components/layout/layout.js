/*
***************************************
Component: Layout
Author: Joimee
Description:
***************************************
*/
import Head from 'next/head';
import Header from '../header/header';
import Footer from '../footer/footer';

const Layout = ({ title, description, children }) => (
  <>
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
    </Head>
    <Header />
    {children}
    <Footer />
  </>
);

Layout.defaultProps = {
  title: 'Palit',
  description: 'Palit Web App',
};

export default Layout;
