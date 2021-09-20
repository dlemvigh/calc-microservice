import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";

const WS_ENDPOINT = "ws://localhost:8081/websockets";
const API_ENDPOINT = "http://localhost:8081";
const REFETCH_INTERVAL = 60 * 1000;
const FACTORIALS_CACHE_KEY = "factorials";

export interface Job {
  id: number;
  input: number;
  output?: string;
  status: string;
  createdAt: string;
  calcStartedAt?: string;
  finishedAt?: string;
}

export async function getFactorials(): Promise<Job[]> {
  const res = await fetch(`${API_ENDPOINT}/factorial`, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    mode: "cors",
  });
  return await res.json();
}

export async function postFactorial({ input }: Pick<Job, "input">) {
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

export function useFactorialSubscription() {
  const queryClient = useQueryClient();
  useEffect(() => {
    const websocket = new WebSocket(WS_ENDPOINT);

    websocket.onopen = () => {
      console.log("connected");
    };

    websocket.onmessage = (event) => {
      const newJob: Job = JSON.parse(event.data);
      queryClient.setQueriesData(
        FACTORIALS_CACHE_KEY,
        (oldData: Job[] | undefined): Job[] => {
          return (
            oldData?.map((job) => (job.id === newJob.id ? newJob : job)) || []
          );
        }
      );
    };

    return () => websocket.close();
  }, [queryClient]);
}
