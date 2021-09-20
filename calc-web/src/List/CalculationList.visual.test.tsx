import { render } from "@testing-library/react";
import { CalculationTable } from "./CalculationList";
import { generateImage } from "jsdom-screenshot";

describe("Calculation table", () => {

    it("empty list has no visual regression", async () => {
        render(<CalculationTable data={[]} />);
        const screenshot = await generateImage();
        expect(screenshot).toMatchImageSnapshot();
    })

    it("created item has no visual regression", async () => {
        render(<CalculationTable data={[{ id: 1, input: 5, status: "pending", createdAt: new Date().toISOString() }]} />);
        const screenshot = await generateImage();
        expect(screenshot).toMatchImageSnapshot();
    });

    it("dequeued item has no visual regression", async () => {
        render(<CalculationTable data={[{ id: 1, input: 5, status: "pending", createdAt: new Date().toISOString(), calcStartedAt: new Date().toISOString() }]} />);
        const screenshot = await generateImage();
        expect(screenshot).toMatchImageSnapshot();
    });

    it("finished item has no visual regression", async () => {
        render(<CalculationTable data={[{ id: 1, input: 5, output: "120", status: "pending", createdAt: new Date().toISOString(), calcStartedAt: new Date().toISOString(), finishedAt: new Date().toISOString() }]} />);
        const screenshot = await generateImage();
        expect(screenshot).toMatchImageSnapshot();
    });
})