import { onMount, onDestroy } from 'svelte';
import { useQuery, useMutation, useQueryClient } from '@sveltestack/svelte-query';

// export const BASE_URL = getFallbackHost(window.location.host);
export const BASE_URL = getFallbackHost();
export const API_ENDPOINT = `http://${BASE_URL}`;
export const WS_ENDPOINT = `ws://${BASE_URL}/websockets`;

export const REFETCH_INTERVAL = 60 * 1000;
export const FACTORIALS_CACHE_KEY = 'factorials';

function getFallbackHost(host?: string) {
	switch (host) {
		case 'calc-web':
			return 'calc-api';
		case 'localhost':
		default:
			return 'localhost:8081';
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

export async function getFactorials(): Promise<Job[]> {
	const res = await fetch(`${API_ENDPOINT}/factorial`, {
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json'
		},
		mode: 'cors'
	});
	return await res.json();

	// const promise = fetch(`${API_ENDPOINT}/factorial`);
	// console.log("promise", promise);
	// const res = await promise;
	// console.log("res", res);
	// const data = await res.json();
	// console.log("data", data);
	// return data;
}

export async function postFactorial({ input }: Pick<Job, 'input'>) {
	const body = JSON.stringify({ input });
	const res = await fetch(`${API_ENDPOINT}/factorial`, {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json'
		},
		mode: 'cors',
		body
	});
	return await res.json();
}

export function useFactorials() {
	return useQuery(FACTORIALS_CACHE_KEY, getFactorials, {
		refetchInterval: REFETCH_INTERVAL
	});
}

export function useCreateFactorial() {
	const queryClient = useQueryClient();
	return useMutation(postFactorial, {
		onSettled: () => {
			queryClient.invalidateQueries(FACTORIALS_CACHE_KEY);
		}
	});
}

export function useFactorialSubscription() {
	const queryClient = useQueryClient();
	let websocket: WebSocket;

	onMount(() => {
		console.log('on mount');
		websocket = new WebSocket(WS_ENDPOINT);

		websocket.onmessage = (event) => {
			const newJob: Job = JSON.parse(event.data);
			queryClient.setQueriesData(FACTORIALS_CACHE_KEY, (oldData: Job[] | undefined): Job[] => {
				if (oldData?.some((job) => job.id === newJob.id)) {
					return oldData?.map((job) => (job.id === newJob.id ? newJob : job)) || [];
				}
				return oldData ? [newJob, ...oldData] : [newJob];
			});
		};
	});

	onDestroy(() => {
		websocket?.close();
	});
}
