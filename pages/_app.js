import Head from 'next/head';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { CacheProvider } from '@emotion/react';
import { Web3ReactProvider } from '@web3-react/core';
import Web3 from 'web3';
import * as React from 'react';
import createEmotionCache from '../styles/createEmotionCache';

// import "../styles/globals.css";
import theme from '../styles/theme';
import AlertProvider from '../providers/AlertProvider';

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

function getLibrary(provider) {
  return new Web3(provider);
}

function MyApp(props) {
  // eslint-disable-next-line react/prop-types
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <title>Etherpreneur</title>
        <meta name='viewport' content='initial-scale=1, width=device-width' />
        <link rel='shortcut icon' href='/images/favicon.png' />
      </Head>
      <ThemeProvider theme={theme}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        <Web3ReactProvider getLibrary={getLibrary}>
          <AlertProvider>
            <Component {...pageProps} />
          </AlertProvider>
        </Web3ReactProvider>
      </ThemeProvider>
    </CacheProvider>
  );
}

export default MyApp;