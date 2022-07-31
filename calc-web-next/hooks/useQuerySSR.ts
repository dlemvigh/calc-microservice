import {
  QueryFunction,
  QueryKey,
  UseQueryOptions,
  UseQueryResult,
  useQuery,
} from "react-query";

export function useQuerySSR<
  TData = unknown,
  TError = unknown,
  TQueryKey extends QueryKey = QueryKey
>(
  queryKey: TQueryKey,
  queryFn: QueryFunction<TData, TQueryKey>,
  initialData: TData,
  options: Omit<
    UseQueryOptions<TData, TError, TData, TQueryKey>,
    "queryKey" | "queryFn" | "initialData"
  > = {}
): UseQueryResult<TData, TError> {
  const extendedOptions = {
    initialData,
    initialDataUpdatedAt: initialData == null ? undefined : Number(new Date()),
    keepPreviousData: true,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    ...options,
  };
  return useQuery(queryKey, queryFn, extendedOptions);
}
