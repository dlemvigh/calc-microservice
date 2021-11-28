import { QueryClient, QueryClientProvider } from "react-query";

import type { AppProps } from 'next/app'
import { useState } from "react";

function MyApp({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(() => new QueryClient());
  // const queryClientRef = useRef(new QueryClient());
  // const queryClient = queryClientRef.current;

  return (
    <QueryClientProvider client={queryClient}>
      <Component {...pageProps} />
    </QueryClientProvider>
  );
}

export default MyApp
