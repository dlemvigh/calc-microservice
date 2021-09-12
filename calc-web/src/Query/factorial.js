import { useQuery, useMutation, useQueryClient } from "react-query";

const API_ENDPOINT = "http://localhost:8081";
const REFETCH_INTERVAL = 60 * 1000;
const FACTORIALS_CACHE_KEY = "factorials";

export async function getFactorials() {
  const res = await fetch(`${API_ENDPOINT}/factorial`, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    mode: "cors",
  });
  return await res.json();
}

export async function postFactorial({ input }) {
  const body = JSON.stringify({ input });
  const res = await fetch(`${API_ENDPOINT}/factorial`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    mode: "cors",
    body,
  });
  return await res.json();
}

export function useFactorials() {
  const { data, error, isLoading } = useQuery(
    FACTORIALS_CACHE_KEY,
    getFactorials,
    {
      refetchInterval: REFETCH_INTERVAL,
    }
  );
  return { data, error, isLoading };
}

export function useCreateFactorial() {
  const queryClient = useQueryClient();
  return useMutation(postFactorial, {
    onSettled: () => {
      queryClient.invalidateQueries(FACTORIALS_CACHE_KEY);
    },
  });
}
