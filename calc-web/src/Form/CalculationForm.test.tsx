import { render, waitFor, screen } from "@testing-library/react";
import user from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "react-query";
import nock from "nock";
import { CalculationForm } from "./CalculationForm";
import { API_ENDPOINT } from "../Query/factorial";

describe("Calculation form", () => {
    const client = new QueryClient();
    it("has input label", () => {

        const { getByLabelText } = render(
            <QueryClientProvider client={client}>
                <CalculationForm />
            </QueryClientProvider>
        );
        expect(getByLabelText("Input")).toBeVisible();
    })

    it("input must be positive", async () => {
        const { getByLabelText } = render(
            <QueryClientProvider client={client}>
                <CalculationForm />
            </QueryClientProvider>
        );

        const input = getByLabelText("Input");
        await user.type(input, "-1");

        await waitFor(() => {
            expect(screen.getByText("Must be a positive number")).toBeVisible();
        })
    })

    it("input must be an integer", async () => {
        const { getByLabelText } = render(
            <QueryClientProvider client={client}>
                <CalculationForm />
            </QueryClientProvider>
        );

        const input = getByLabelText("Input");
        await user.type(input, "1.2");

        await waitFor(() => {
            expect(screen.getByText("Must be a whole number")).toBeVisible();
        })
    })

    it("input is required", async () => {
        const { getByLabelText } = render(
            <QueryClientProvider client={client}>
                <CalculationForm />
            </QueryClientProvider>
        );

        const input = getByLabelText("Input");
        await user.clear(input);

        await waitFor(() => {
            expect(screen.getByText("Required")).toBeVisible();
        })
    })

    it("submit triggers POST", async () => {
        const scope = nock(API_ENDPOINT).post('/factorial').reply(200, { id: 1 }, {
            'Access-Control-Allow-Origin': '*',
            'Content-type': 'application/json'
        });

        const { getByText } = render(
            <QueryClientProvider client={client}>
                <CalculationForm />
            </QueryClientProvider>
        );

        const btn = getByText("calc");
        user.click(btn);

        await waitFor(() => {
            expect(scope.isDone()).toBe(true);
        })
    })
})