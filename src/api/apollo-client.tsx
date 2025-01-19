import { useAuth } from "../hooks/useAth";
import { ApolloClient, ApolloLink, createHttpLink, InMemoryCache, split } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from '@apollo/client/link/error'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { getMainDefinition } from "@apollo/client/utilities";
import { createClient } from 'graphql-ws';

const backendApi = process.env.NEXT_PUBLIC_GRAPHQL_API_URL ?? "http://localhost:4000/graphql"

const httpLink = createHttpLink({
  uri: backendApi,
});

export function useViajeroApolloClient() {
  const authLink = setContext((_, { headers }) => {
    // get the authentication token from local storage if it exists
    const storage = localStorage.getItem("viajeros-user");
    const store = storage ? JSON.parse(storage) : null;

    const token = store?.state?.currentUser?.accessToken?.value;
    // return the headers to the context so httpLink can read them
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : "",
      },
    };
  });

  const wsLink = new GraphQLWsLink(createClient({
    url: process.env.NEXT_PUBLIC_GRAPHQL_API_URL ?? "http://localhost:4000/graphql",
  }));

  const splitLink = split(
    ({ query }) => {
      const definition = getMainDefinition(query);
      return (
        definition.kind === 'OperationDefinition' &&
        definition.operation === 'subscription'
      );
    },
    wsLink,
    httpLink,
  );
  const { currentUser, onLogout } = useAuth()

  const errorLink = onError(({ graphQLErrors }) => {
    if (graphQLErrors) {
      graphQLErrors.forEach((error) => {
        const { message, code, path } = error as any

        console.error(`[GraphQL error]: Message: ${message}, Path: ${path?.toString()}, Code: ${code}`)

        if (code === 'UNAUTHENTICATED') {
          onLogout(currentUser?.id)
        }
      })
    }
  })

  return new ApolloClient({
    cache: new InMemoryCache(),
    link: ApolloLink.from([
      errorLink,
      authLink,
      splitLink
    ]),
  });
}
