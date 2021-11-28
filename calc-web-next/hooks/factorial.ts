import {
  UseMutationResult,
  UseQueryResult,
  useMutation,
  useQuery,
  useQueryClient,
} from "react-query";
import { useEffect, useState } from "react";

import { ifWindow } from "../lib/ifWindow";
import { useQuerySSR } from "./useQuerySSR";

export const BASE_URL =
  process.env.REACT_APP_BASE_URL ||
  getFallbackHost(ifWindow(() => window.location.host));
export const API_ENDPOINT = `http://${BASE_URL}`;
export const WS_ENDPOINT = `ws://${BASE_URL}/websockets`;

export const REFETCH_INTERVAL = 60 * 1000;
export const FACTORIALS_CACHE_KEY = "factorials";

function getFallbackHost(host?: string) {
  switch (host) {
    case "calc-web":
      return "calc-api";
    case "localhost":
    default:
      return "localhost:8081";
  }
}

export interface Job {
  id: number;
  input: number;
  output?: string;
  status?: string;
  createdAt: string;
  calcStartedAt?: string;
  finishedAt?: string;
}

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

export async function postFactorial({
  input,
}: Pick<Job, "input">): Promise<Job> {
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

export function useFactorials(initialData: Job[]) {
  // return useQuery(FACTORIALS_CACHE_KEY, getFactorials, {
  //   refetchInterval: REFETCH_INTERVAL,
  // });
  return useQuerySSR(FACTORIALS_CACHE_KEY, getFactorials, initialData, {
    refetchInterval: REFETCH_INTERVAL,
  });
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
  const [status, setStatus] = useState("pending");
  const [count, setCount] = useState(0);

  useEffect(() => {
    const websocket = new WebSocket(WS_ENDPOINT);

    websocket.onopen = () => {
      setStatus("open");
    };

    websocket.onmessage = (event) => {
      const newJob: Job = JSON.parse(event.data);
      queryClient.setQueriesData(
        FACTORIALS_CACHE_KEY,
        (oldData: Job[] | undefined): Job[] => {
          if (oldData?.some((job) => job.id === newJob.id)) {
            return (
              oldData?.map((job) => (job.id === newJob.id ? newJob : job)) || []
            );
          }
          return oldData ? [newJob, ...oldData] : [newJob];
        }
      );
      setCount((x) => x + 1);
    };

    return () => websocket.close();
  }, [queryClient]);

  return { status, count };
}
