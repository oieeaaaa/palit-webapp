import Head from 'next/head';
import Header from 'components/header/header';
import GridGuides from 'styleguide/grid-guide';

const Home = () => (
  <div className="container">
    <Head>
      <title>Palit</title>
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <Header />
    <h1>When I&#39;m home</h1>
    <GridGuides />
  </div>
);

export default Home;
