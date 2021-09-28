import "mocha";
import "sinon-chai";
import { expect } from "chai";
import sinon from "sinon";

import { Config } from "../src/config";
import { SqsClient } from "../src/aws/sqs";
import { PostResult } from "../src/api/api";
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
    const config = {} as Config;

    const sqs = {
      receiveMessage: sinon.fake(() => Promise.reject("No data")),
      deleteMessage: sinon.fake(),
    };
    const api = sinon.fake();

    const doWork = worker(
      config,
      sqs as SqsClient,
      factorial,
      api as PostResult
    );
    doWork();

    expect(api).not.to.have.been.called;
  });

  it("does work", async () => {
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
    const postResult = sinon.fake();
    // postResult();

    const doWork = worker(
      config,
      sqs as SqsClient,
      factorial,
      postResult as PostResult
    );
    const didWork = await doWork();

    expect(didWork).to.be.true;
    expect(postResult).to.have.been.calledTwice;
    expect(postResult).to.have.been.calledWith({
      id,
      calcStartedAt: new Date(),
    });
    expect(postResult).to.have.been.calledWith({
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

    const postResult = sinon.fake();
    // postResult();

    const doWork = worker(
      config,
      sqs as SqsClient,
      factorial as any,
      postResult as PostResult
    );

    // act
    const workPromise = doWork();
    const didWork = await doWork();

    // assert
    expect(didWork).to.be.false;
    expect(sqs.deleteMessage).not.to.have.been.called;

    await workPromise;
    expect(sqs.deleteMessage).to.have.been.called;
  });
});
