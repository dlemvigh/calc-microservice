"use strict";
import chai from "chai";
import sinonChai from "sinon-chai";

chai.use(sinonChai);
chai.should();

export function swallow(thrower: any) {
  try {
    thrower();
  } catch (e) {
    // Intentionally swallow
  }
}
