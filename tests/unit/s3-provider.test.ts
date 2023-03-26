'use strict';

import {S3Provider} from "../../src/service/s3-provider";

describe('S3 data provider connectivity', function () {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules()
    process.env = { ...OLD_ENV };
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  it('Init with no params should return throw error', async () => {
    expect(() => new S3Provider(undefined, undefined, undefined))
      .toThrow("Bucket name or region not specified.");
  });

});
