import { FC } from "react";
import { renderHook, act } from "@testing-library/react-hooks";
import faker from "faker";
import nock from "nock";
import { QueryClient, QueryClientProvider } from "react-query";

import { useFactorials, useCreateFactorial, API_ENDPOINT } from "./factorial";

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

  it.todo("useFactorialSubscription");
});
