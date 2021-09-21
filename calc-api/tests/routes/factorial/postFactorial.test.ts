import "mocha";
import "sinon-chai";
import { expect } from "chai";
import sinon from "sinon";
import { EventEmitter } from "events";
import { NextFunction, Request, Response } from "express";
import faker from "faker";

import { postFactorial } from "../../../src/routes/factorial/postFactorial";

describe("post factorial", () => {
  it("returns status 200", async () => {
    // arrange inputs
    const id = faker.datatype.number(1000);
    const input = faker.datatype.number(1000);

    // arrange dependencies
    const sqs = {
      sendJSON: sinon.fake(),
      sendMessage: sinon.fake(),
    };
    const ee = sinon.spy(new EventEmitter());
    const repo = {
      getFactorial: sinon.fake(),
      getFactorials: sinon.fake(),
      createFactorial: sinon.fake((item: object) => ({ id, ...item })),
      updateFractorial: sinon.fake(),
      clearFactorials: sinon.fake(),
    };

    const req = {
      body: { input },
    };
    const res = {
      json: sinon.fake(),
      status: sinon.fake(),
      send: sinon.fake(),
    };

    // act
    await postFactorial(sqs, ee, repo)(
      req as Request,
      res as any,
      {} as NextFunction
    );

    // assert
    expect(res.status).to.have.been.calledWith(200);
    expect(res.json).to.have.been.calledWith({ id, input });

    expect(ee.emit).to.have.been.calledWith("created", { id, input });
    expect(sqs.sendJSON).to.have.been.calledWith({
      version: "v1",
      id,
      input,
    });
  });

  it("returns item");
  it("creates item in db");
  it("emit created event");

  it("fails on invalid input");
  it("does not emit event invalid input");
  it("does not create item in db on invalid input");
});
