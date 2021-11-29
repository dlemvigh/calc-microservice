// jest.setup.js

import "@testing-library/jest-dom/extend-expect";
import "next";

import { toMatchImageSnapshot } from "jest-image-snapshot";

expect.extend({ toMatchImageSnapshot });
