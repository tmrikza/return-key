import LoginPage from '@/components/LoginPage';
import Head from 'next/head';
import { Fragment } from 'react';

const Login = () => {
  return (
    <Fragment>
      <Head>
        <title>Login</title>
      </Head>
      <LoginPage />
    </Fragment>
  );
};

export default Login;