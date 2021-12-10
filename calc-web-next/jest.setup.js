// jest.setup.js

import "next";
import "@testing-library/jest-dom/extend-expect";

import { toMatchImageSnapshot } from "jest-image-snapshot";

expect.extend({ toMatchImageSnapshot });
