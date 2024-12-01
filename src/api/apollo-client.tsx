import { useAuth } from "../hooks/useAth";
import { ApolloClient, ApolloLink, createHttpLink, InMemoryCache } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from '@apollo/client/link/error'

const httpLink = createHttpLink({
  uri: "http://localhost:4000/graphql",
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
      authLink.concat(httpLink),
    ]),
  });
}
