import Head from 'next/head';
import StyleGuide from 'styleguide/styleguide';

const Home = () => (
  <div className="container">
    <Head>
      <title>Boilerplate</title>
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <StyleGuide />
  </div>
);

export default Home;
