import { test, expect } from "@playwright/experimental-ct-react";
import { CalculationTable } from "./CalculationList";

test.describe("CalculationList visual regression", () => {

    test("empty list has no visual regression", async ({ mount }) => {
        const component = await mount(<CalculationTable data={[]} />);
        await expect(component).toHaveScreenshot();
    })

    test("created item has no visual regression", async ({ mount }) => {
        const component = await mount(<CalculationTable data={[{ id: 1, input: 5, status: "pending", createdAt: new Date().toISOString() }]} />);
        await expect(component).toHaveScreenshot();
    });

    test("dequeued item has no visual regression", async ({ mount }) => {
        const date = new Date().toISOString()
        const component = await mount(<CalculationTable data={[{ id: 1, input: 5, status: "pending", createdAt: date, calcStartedAt: date }]} />);
        await expect(component).toHaveScreenshot();
    });

    test("finished item has no visual regression", async ({ mount }) => {
        const date = new Date().toISOString()
        const component = await mount(<CalculationTable data={[{ id: 1, input: 5, output: "120", status: "pending", createdAt: date, calcStartedAt: date, finishedAt: date }]} />);
        await expect(component).toHaveScreenshot();
    });
})