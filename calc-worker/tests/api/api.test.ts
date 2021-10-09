import "mocha";
import { expect } from "chai";
import nock from "nock";

import { Config } from "../../src/config";
import { apiClientFactory } from "../../src/api/api";
import { Job } from "../../src/interfaces";

describe("api", () => {
  const API_ENDPOINT = "http://fake.api";

  const config = {
    API_ENDPOINT,
  } as Config;

  it("calls fetch", async () => {
    const id = 42;
    const job = {
      id: 42,
      calcStartedAt: new Date(),
      input: 5,
      output: "some-output",
      version: "some-version",
      status: "some-status",
    } as Job;

    const client = apiClientFactory(config);

    const scope = nock(API_ENDPOINT)
      .put(`/factorial/${id}`, JSON.stringify(job))
      .reply(200);

    await client.postResult(job);

    expect(scope.isDone()).to.be.true;
  });
});
