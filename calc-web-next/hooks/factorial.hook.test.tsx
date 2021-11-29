import { FC } from "react";
import { renderHook, act } from "@testing-library/react-hooks";
import faker from "faker";
import WS from "jest-websocket-mock";
import nock from "nock";
import { QueryClient, QueryClientProvider } from "react-query";

import {
  useFactorials,
  useCreateFactorial,
  useFactorialSubscription,
  API_ENDPOINT,
  WS_ENDPOINT
} from "./factorial";

describe("factorial", () => {
  it("useFactorials", async () => {
    const queryClient = new QueryClient();
    const wrapper: FC = ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const data = [{ id: faker.datatype.number() }];
    const scope = nock(API_ENDPOINT)
      .defaultReplyHeaders({
        'access-control-allow-origin': '*'
      })
      .get('/factorial')
      .reply(200, data);

    const { result, waitFor } = renderHook(() => useFactorials(), { wrapper });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBe(undefined);

    await waitFor(() => result.current.isSuccess);

    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toEqual(data);

    scope.done();
  });

  it("useCreateFactorials", async () => {
    const id = faker.datatype.number();
    const input = faker.datatype.number();

    const queryClient = new QueryClient();
    const wrapper: FC = ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const scope = nock(API_ENDPOINT)
      .defaultReplyHeaders({
        'access-control-allow-origin': '*'
      })
      .post('/factorial')
      .reply(200, {
        id,
        input
      });



    const { result } = renderHook(() => useCreateFactorial(), { wrapper });

    await act(async () => {
      await result.current.mutateAsync({ input })
    });

    scope.done();
  });

  it("useCreateFactorials invalidates useFactorials", async () => {
    const id = faker.datatype.number();
    const input = faker.datatype.number();

    const queryClient = new QueryClient();
    const wrapper: FC = ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const scope = nock(API_ENDPOINT)
      .defaultReplyHeaders({
        'access-control-allow-origin': '*'
      })
      .get('/factorial')
      .reply(200, [])
      .post('/factorial')
      .reply(200, {
        id,
        input
      }).get('/factorial')
      .reply(200, [{ id, input }]);

    const { result } = renderHook(() => {
      const get = useFactorials();
      const post = useCreateFactorial();
      return { get, post };
    }, { wrapper });

    await act(async () => {
      await result.current.post.mutateAsync({ input })
    });

    scope.done();
  });

  it("useFactorialSubscription", async () => {
    const id = faker.datatype.number();
    const input = faker.datatype.number();
    const output = faker.datatype.number().toLocaleString();

    const queryClient = new QueryClient();
    const wrapper: FC = ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const server = new WS(WS_ENDPOINT);
    const scope = nock(API_ENDPOINT)
      .defaultReplyHeaders({
        'access-control-allow-origin': '*'
      })
      .get('/factorial')
      .reply(200, []);

    const { result, waitFor, waitForNextUpdate } = renderHook(() => {
      const get = useFactorials();
      const sub = useFactorialSubscription()
      return { get, sub }
    }, { wrapper });

    await waitFor(() => result.current.get.isSuccess);

    // send one item
    act(() => server.send(JSON.stringify({ id, input })));
    await waitForNextUpdate();

    expect(result.current.get.data).toEqual([{ id, input }]);


    // update one item
    act(() => server.send(JSON.stringify({ id, input, output })));
    await waitForNextUpdate();

    expect(result.current.get.data).toEqual([{ id, input, output }]);

    // send second item
    const data = { id: faker.datatype.number() };
    act(() => server.send(JSON.stringify(data)));
    await waitForNextUpdate();

    expect(result.current.get.data).toEqual([data, { id, input, output }]);

    scope.done();
    server.close();
    WS.clean();
  });
});
