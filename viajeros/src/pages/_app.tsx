// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import '@mantine/core/styles.css';

import client from "@/api/apollo-client";
import type { AppProps } from 'next/app';
import { createTheme, MantineProvider } from '@mantine/core';
import { useRouter } from 'next/router';
import { AppContainer } from '@/components/AppContainer/AppContainer';
import { ApolloProvider } from '@apollo/client';
import '../styles/globals.css';

const theme = createTheme({
  /** Put your mantine theme override here */
  // We need to define what style we want for Viajeros!
});


export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  // Routes that shouldn't have the Mantine AppShell layout.
  // The other approach is to use per-page layouts
  const noLayoutPages = ['/', '/login'];

  // Check if the current route is one of the no layout pages
  const isNoLayoutPage = noLayoutPages.includes(router.pathname);

  return (
    <MantineProvider theme={theme}>
      {isNoLayoutPage ? (
        <ApolloProvider client={client}>
          <Component {...pageProps} />
        </ApolloProvider>
      ) : (
        <AppContainer>
          <ApolloProvider client={client}>
            <Component {...pageProps} />
          </ApolloProvider>
        </AppContainer>
      )}
    </MantineProvider>
  );
}