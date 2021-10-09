import "mocha";
import "sinon-chai";
import { expect } from "chai";
import sinon from "sinon";

import { Config } from "../src/config";
import { SqsClient } from "../src/aws/sqs";
import { ApiClient } from "../src/api/api";
import { factorial, Factorial } from "../src/api/calc";
import { worker } from "../src/worker";

describe("worker loop", () => {
  const deferrable = () => {
    let resolve;
    let reject;
    const promise = new Promise((res, rej) => {
      resolve = res;
      reject = rej;
    });
    return { promise, resolve, reject };
  };

  it("does nothing if there is no work", () => {
    // arrange
    const config = {} as Config;

    const sqs = {
      receiveMessage: sinon.fake(() => Promise.reject("No data")),
      deleteMessage: sinon.fake(),
    };
    const api = {
      postResult: sinon.fake(),
    };

    // act
    const doWork = worker(
      config,
      sqs as SqsClient,
      factorial,
      api as ApiClient
    );
    doWork();

    // assert
    expect(api.postResult).not.to.have.been.called;
  });

  it("does work", async () => {
    // arrange
    const clock = sinon.useFakeTimers();
    const id = Math.ceil(Math.random() * 1000);
    const input = 5;
    const output = "120";

    const msg = {
      json: {
        id,
        input,
      },
    };

    const config = {
      DEBUG: false,
    } as Config;

    const sqs = {
      receiveMessage: sinon.fake(() => Promise.resolve(msg)),
      deleteMessage: sinon.fake(),
    };
    const api = {
      postResult: sinon.fake(),
    };

    // act
    const doWork = worker(
      config,
      sqs as SqsClient,
      factorial,
      api as ApiClient
    );
    const didWork = await doWork();

    // assert
    expect(didWork).to.be.true;
    expect(api.postResult).to.have.been.calledTwice;
    expect(api.postResult).to.have.been.calledWith({
      id,
      calcStartedAt: new Date(),
    });
    expect(api.postResult).to.have.been.calledWith({
      id,
      output,
      finishedAt: new Date(),
    });
    expect(sqs.deleteMessage).to.have.been.calledWith(msg);

    clock.restore();
  });

  it("it ignores work while in progrogress", async () => {
    // arrange
    const id = Math.ceil(Math.random() * 1000);
    const input = 5;

    const msg = {
      json: {
        id,
        input,
      },
    };

    const config = {
      DEBUG: false,
    } as Config;

    const sqs = {
      receiveMessage: sinon.fake(() => Promise.resolve(msg)),
      deleteMessage: sinon.fake(),
    };

    const api = {
      postResult: sinon.fake(),
    };

    // act
    const doWork = worker(
      config,
      sqs as SqsClient,
      factorial as any,
      api as ApiClient
    );

    const workPromise = doWork();
    const didWork = await doWork();

    // assert
    expect(didWork).to.be.false;
    expect(sqs.deleteMessage).not.to.have.been.called;

    await workPromise;
    expect(sqs.deleteMessage).to.have.been.called;
  });
});
