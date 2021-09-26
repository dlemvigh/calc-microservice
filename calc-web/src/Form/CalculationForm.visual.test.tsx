import { render, waitFor, screen } from "@testing-library/react";
import user from "@testing-library/user-event";
import { generateImage } from "jsdom-screenshot";
import { QueryClient, QueryClientProvider } from "react-query";

import { CalculationForm } from "./CalculationForm";

describe("CalculationForm visual regressions", () => {

    const client = new QueryClient();

    function renderWithQueryClient(ui: React.ReactElement) {
        return render(
            <QueryClientProvider client={client}>
                {ui}
            </QueryClientProvider>
        );
    }

    it("form", async () => {
        renderWithQueryClient(<CalculationForm />);
        const screenshot = await generateImage();
        expect(screenshot).toMatchImageSnapshot();
    })

    it("input must be positive", async () => {
        const { getByLabelText } = renderWithQueryClient(<CalculationForm />);

        const input = getByLabelText("Input");
        await user.type(input, "-1");

        await waitFor(() => {
            expect(screen.getByText("Must be a positive number")).toBeVisible();
        })

        const screenshot = await generateImage();
        expect(screenshot).toMatchImageSnapshot();
    })

    it("input must be an integer", async () => {
        const { getByLabelText } = renderWithQueryClient(<CalculationForm />);

        const input = getByLabelText("Input");
        await user.type(input, "1.2");

        await waitFor(() => {
            expect(screen.getByText("Must be a whole number")).toBeVisible();
        })

        const screenshot = await generateImage();
        expect(screenshot).toMatchImageSnapshot();
    })

    it("input is required", async () => {
        const { getByLabelText } = renderWithQueryClient(<CalculationForm />);

        const input = getByLabelText("Input");
        await user.clear(input);

        await waitFor(() => {
            expect(screen.getByText("Required")).toBeVisible();
        })

        const screenshot = await generateImage();
        expect(screenshot).toMatchImageSnapshot();
    })
})