// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import "@mantine/core/styles.css";
import '@mantine/notifications/styles.css';

import { useViajeroApolloClient } from "..//api/apollo-client";
import type { AppProps } from "next/app";
import { createTheme, MantineProvider } from "@mantine/core";
import { useRouter } from "next/router";
import { AppContainer } from "..//components/AppContainer/AppContainer";
import { ApolloProvider } from "@apollo/client";
import { useAuth } from "..//hooks/useAth";
import { useEffect } from "react";
import useAuthStore from "../stores/useAuthStore";
import UnauthenticatedRoutes from "../components/AuthenticationRoutes/UnauthenticatedRoutes";
import AuthenticatedRoutes from "../components/AuthenticationRoutes/AuthenticatedRoutes";
import { Notifications } from "@mantine/notifications";
import '@mantine/dates/styles.css';
import React from "react";
import '../styles/styles.css';

const theme = createTheme({
  /** Put your mantine theme override here */
  // We need to define what style we want for Viajeros!
});

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  // Routes that shouldn't have the Mantine AppShell layout.
  // The other approach is to use per-page layouts
  const publicPages = ["/", "/login"];

  // Public pages does not have the App Layout.
  const isPublicPage = publicPages.includes(router.pathname);

  const client = useViajeroApolloClient()

  return (
    <MantineProvider theme={theme}>
      <Notifications position="bottom-right" />
      {isPublicPage ? (
        <ApolloProvider client={client}>
          <UnauthenticatedRoutes>
            <Component {...pageProps} />
          </UnauthenticatedRoutes>
        </ApolloProvider>
      ) : (
        <>
          <AuthenticatedRoutes>
            <AppContainer>
              <ApolloProvider client={client}>
                <Component {...pageProps} />
              </ApolloProvider>
            </AppContainer>
          </AuthenticatedRoutes>
        </>
      )}
    </MantineProvider>
  );
}