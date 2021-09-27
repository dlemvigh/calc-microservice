import { render, waitFor, screen } from "@testing-library/react";
import { generateImage } from "jsdom-screenshot";
import { QueryClient, QueryClientProvider } from "react-query";
import nock from "nock";
import WS from "jest-websocket-mock";

import App from "./App";
import { API_ENDPOINT, WS_ENDPOINT } from "./Query/factorial";

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
        await render(
            <QueryClientProvider client={client}>
                <App />
            </QueryClientProvider>
        );

        await waitFor(() => scope.done());

        const screenshot = await generateImage();
        expect(screenshot).toMatchImageSnapshot();
        server.close();
    });

    it("Has items", async () => {
        const server = new WS(WS_ENDPOINT);
        const scope = nock(API_ENDPOINT)
            .defaultReplyHeaders({
                'access-control-allow-origin': '*'
            })
            .get("/factorial")
            .reply(200, [{ id: 1, input: 5, output: "120" }]);

        const client = new QueryClient();
        await render(
            <QueryClientProvider client={client}>
                <App />
            </QueryClientProvider>
        );

        await waitFor(() => scope.done());
        console.log(client)

        const screenshot = await generateImage();
        expect(screenshot).toMatchImageSnapshot();
        server.close();
    });
})