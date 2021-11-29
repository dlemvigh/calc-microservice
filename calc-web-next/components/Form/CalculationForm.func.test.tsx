import { QueryClient, QueryClientProvider } from "react-query";
import { render, screen, waitFor } from "@testing-library/react";

import { API_ENDPOINT } from "../../hooks/factorial";
import { CalculationForm } from "./CalculationForm";
import nock from "nock";
import user from "@testing-library/user-event";

describe("CalculationForm functional tests", () => {
    const client = new QueryClient();

    function renderWithQueryClient(ui: React.ReactElement) {
        return render(
            <QueryClientProvider client={client}>
                {ui}
            </QueryClientProvider>
        );
    }

    it("has input label", () => {
        const { getByLabelText } = renderWithQueryClient(<CalculationForm />);
        expect(getByLabelText("Input")).toBeVisible();
    })

    it("input must be positive", async () => {
        const { getByLabelText } = renderWithQueryClient(<CalculationForm />);

        const input = getByLabelText("Input");
        await user.clear(input);
        await user.type(input, "-1");

        await waitFor(() => {
            expect(screen.getByText("Must be a positive number")).toBeVisible();
        })
    })

    it("input must be an integer", async () => {
        const { getByLabelText } = renderWithQueryClient(<CalculationForm />);

        const input = getByLabelText("Input");
        await user.type(input, "1.2");

        await waitFor(() => {
            expect(screen.getByText("Must be a whole number")).toBeVisible();
        })
    })

    it("input is required", async () => {
        const { getByLabelText } = renderWithQueryClient(<CalculationForm />);

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

        const { getByText } = renderWithQueryClient(<CalculationForm />);

        const btn = getByText("calc");
        user.click(btn);

        await waitFor(() => {
            expect(scope.isDone()).toBe(true);
        })
    })
})