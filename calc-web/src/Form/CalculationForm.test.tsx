import { render, waitFor, screen, } from "@testing-library/react";
import user from "@testing-library/user-event";
import { CalculationForm } from "./CalculationForm";
import { QueryClient, QueryClientProvider } from "react-query";

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

})