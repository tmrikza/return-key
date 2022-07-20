import { Fragment } from 'react';

import type { NextPage } from 'next';
import Head from 'next/head';

import Homepage from '@/components/HomePage';

const Home: NextPage = () => {
  return (
    <Fragment>
      <Head>
        <title>Homepage</title>
      </Head>
      <Homepage />
    </Fragment>
  );
};

export default Home;
