import { render, waitFor, screen } from "@testing-library/react";
import { generateImage } from "jsdom-screenshot";
import { QueryClient, QueryClientProvider } from "react-query";
import nock from "nock";
import WS from "jest-websocket-mock";
import { addMilliseconds, addSeconds, addMinutes, addHours } from "date-fns";
import faker from "faker";

import App from "./App";
import { API_ENDPOINT, Job, WS_ENDPOINT } from "./Query/factorial";

describe("App", () => {
    it("Empty list", async () => {
        const server = new WS(WS_ENDPOINT);
        const scope = nock(API_ENDPOINT)
            .defaultReplyHeaders({
                'access-control-allow-origin': '*'
            })
            .get("/factorial")
            .reply(200, []);

        const client = new QueryClient();
        const { findByText } = await render(
            <QueryClientProvider client={client}>
                <App />
            </QueryClientProvider>
        );

        await waitFor(() => scope.done());
        await waitFor(() => findByText("n!"));

        const screenshot = await generateImage();
        expect(screenshot).toMatchImageSnapshot();
        server.close();
    });

    it("Has items", async () => {
        const now = new Date()
        const data: Job[] = [
            { id: 1, input: 5, output: "120", createdAt: now.toISOString() },
            { id: 2, input: 5, output: "120", createdAt: now.toISOString(), calcStartedAt: addMilliseconds(now, 250).toISOString() },
            { id: 3, input: 5, output: "120", createdAt: now.toISOString(), calcStartedAt: addSeconds(now, 55).toISOString() },
            { id: 4, input: 5, output: "120", createdAt: now.toISOString(), calcStartedAt: addMinutes(now, 12).toISOString() },
            { id: 5, input: 5, output: "120", createdAt: now.toISOString(), calcStartedAt: addHours(now, 2).toISOString() },
            { id: 6, input: 5, output: "120", createdAt: now.toISOString(), calcStartedAt: addMilliseconds(now, 12).toISOString(), finishedAt: addMilliseconds(now, 22).toISOString() },
        ];
        const server = new WS(WS_ENDPOINT);
        const scope = nock(API_ENDPOINT)
            .defaultReplyHeaders({
                'access-control-allow-origin': '*'
            })
            .get("/factorial")
            .reply(200, data);

        const client = new QueryClient();
        const { getByTestId } = await render(
            <QueryClientProvider client={client}>
                <App />
            </QueryClientProvider>
        );

        await waitFor(() => scope.done());
        await waitFor(() => getByTestId("row-0-input"))

        const screenshot = await generateImage();
        expect(screenshot).toMatchImageSnapshot();
        server.close();
    });
})