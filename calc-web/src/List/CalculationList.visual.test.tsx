import { render } from "@testing-library/react";
import { CalculationTable } from "./CalculationList";
import { generateImage } from "jsdom-screenshot";

describe("CalculationList visual regression", () => {

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
        const date = new Date().toISOString()
        render(<CalculationTable data={[{ id: 1, input: 5, status: "pending", createdAt: date, calcStartedAt: date }]} />);
        const screenshot = await generateImage();
        expect(screenshot).toMatchImageSnapshot();
    });

    it("finished item has no visual regression", async () => {
        const date = new Date().toISOString()
        render(<CalculationTable data={[{ id: 1, input: 5, output: "120", status: "pending", createdAt: date, calcStartedAt: date, finishedAt: date }]} />);
        const screenshot = await generateImage();
        expect(screenshot).toMatchImageSnapshot();
    });
})