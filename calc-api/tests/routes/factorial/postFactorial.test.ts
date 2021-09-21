import "mocha";
import "sinon-chai";
import { expect } from "chai";
import sinon, { SinonFakeTimers, SinonSandbox } from "sinon";
import { EventEmitter } from "events";
import { NextFunction, Request, Response } from "express";
import faker from "faker";

import { postFactorial } from "../../../src/routes/factorial/postFactorial";

describe("post factorial", () => {
  const now = new Date();
  let sandbox: SinonSandbox;
  let clock: SinonFakeTimers;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    clock = sinon.useFakeTimers(now.getTime());
  });

  afterEach(() => {
    sandbox.restore();
    clock.restore();
  });

  it("successfully calls all dependants", async () => {
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
    expect(res.json).to.have.been.calledWith({
      id,
      input,
      status: "pending",
      createdAt: now,
    });
    expect(ee.emit).to.have.been.calledWith("created", {
      id,
      input,
      status: "pending",
      createdAt: now,
    });
    expect(sqs.sendJSON).to.have.been.calledWith({
      version: "v1",
      id,
      input,
    });
  });

  it("returns 500 on error", async () => {
    // arrange inputs
    const error = faker.random.word();
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
      createFactorial: sinon.fake.throws(new Error(error)),
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
    expect(res.status).to.have.been.calledWith(500);
    expect(res.send).to.have.been.calledWith(error);
    expect(res.json).not.to.have.been.called;
    expect(ee.emit).not.to.have.been.called;
    expect(sqs.sendJSON).not.to.have.been.called;
  });
});
