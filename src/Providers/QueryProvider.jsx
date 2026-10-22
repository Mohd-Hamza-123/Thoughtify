import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60,          // treat data as fresh for 1 minute
      gcTime: 1000 * 60 * 10,        // keep unused cache for 10 minutes
      refetchOnWindowFocus: false,
      retry: (failureCount, error) => {
        // Don't retry client errors (401, 403, 404...) - Appwrite errors expose `code`
        if (error?.code >= 400 && error?.code < 500) return false;
        return failureCount < 2;
      },
    },
  },
});

function QueryProvider({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}

export default QueryProvider;
