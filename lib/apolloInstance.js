import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

let apolloClient = null;

export function initializeApollo() {
  // Create Apollo Client if it doesn't exist
  if (!apolloClient) {
    apolloClient = new ApolloClient({
      cache: new InMemoryCache(),
      defaultOptions: {
        watchQuery: {
          fetchPolicy: 'no-cache',
          errorPolicy: 'ignore',
        },
        query: {
          fetchPolicy: 'no-cache',
          errorPolicy: 'all',
        },
      },
      link: new HttpLink({
        uri: process.env.NEXT_PUBLIC_WORDPRESS_API_URL,
        // Headers to bypass Cloudflare protection
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'application/json',
          'Accept-Language': 'en-US,en;q=0.9',
          'Origin': 'https://www.piratemobile.net',
          'Referer': 'https://www.piratemobile.net/',
        },
        // Increase timeout for Cloudflare-protected sites
        fetchOptions: {
          timeout: 30000,
          redirect: 'follow',
          cache: 'no-store',
        },
      }),
    });
  }
  
  return apolloClient;
}