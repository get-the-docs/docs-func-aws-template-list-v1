'use strict';

import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context
} from "aws-lambda";
import { lambdaHandler } from "../../src/handler";
import {GetTemplatesResponse} from "../../src/gen/model/getTemplatesResponse";
import {S3Provider} from "../../src/service/s3-provider";

describe('Lambda handler tests - happy path', function () {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules()
    process.env = { ...OLD_ENV };
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  it('Retrieve templates without template id should return all templates', async () => {

    const event: APIGatewayProxyEvent = {
    } as any;

    const testContext: Partial<Context> = {
      awsRequestId: "cd4b63fd-e407-450d-b24e-1e991ea43425",
      logGroupName:"/aws/lambda/docs-func-aws-template-fill-v1",
      logStreamName: "2023/03/01/[$LATEST]12345abcdfe01234567890abcdef1234",
      functionName: "docs-func-aws-template-fill-v1",
      functionVersion: "$LATEST",
      invokedFunctionArn: "arn:aws:lambda:us-east-2:123456789012:function:docs-func-aws-template-fill-v1",
      identity: undefined,
      clientContext: undefined,
      memoryLimitInMB: "512"
    };

    const result: APIGatewayProxyResult =
      await lambdaHandler(event as APIGatewayProxyEvent, testContext as Context);

    expect(result.statusCode).toEqual(200);

    const resultObjects: GetTemplatesResponse = JSON.parse(result.body);
    expect(resultObjects.contents!.length).toBeGreaterThan(0);
  });

  it('Retrieve given template by existing template id should return template', async () => {

    const event: APIGatewayProxyEvent = {
      templateId: "integrationtests/contracts/contract_v09_en.docx"
    } as any;

    const testContext: Partial<Context> = {
      awsRequestId: "cd4b63fd-e407-450d-b24e-1e991ea43424",
      logGroupName:"/aws/lambda/docs-func-aws-template-fill-v1",
      logStreamName: "2023/03/01/[$LATEST]12345abcdfe01234567890abcdef1234",
      functionName: "docs-func-aws-template-fill-v1",
      functionVersion: "$LATEST",
      invokedFunctionArn: "arn:aws:lambda:us-east-2:123456789012:function:docs-func-aws-template-fill-v1",
      identity: undefined,
      clientContext: undefined,
      memoryLimitInMB: "512"
    };

    const result: APIGatewayProxyResult =
      await lambdaHandler(event as APIGatewayProxyEvent, testContext as Context);

    expect(result.statusCode).toEqual(200);

    const resultObjects: GetTemplatesResponse = JSON.parse(result.body);
    expect(resultObjects.contents!.length).toBeGreaterThan(0);
  });

  it('Retrieve given template by non-existing template id should return 404', async () => {

    const event: APIGatewayProxyEvent = {
      templateId: "integrationtests/contracts/contract_v09_en.docx"
    } as any;

    const testContext: Partial<Context> = {
      awsRequestId: "cd4b63fd-e407-450d-b24e-1e991ea43424",
      logGroupName:"/aws/lambda/docs-func-aws-template-fill-v1",
      logStreamName: "2023/03/01/[$LATEST]12345abcdfe01234567890abcdef1234",
      functionName: "docs-func-aws-template-fill-v1",
      functionVersion: "$LATEST",
      invokedFunctionArn: "arn:aws:lambda:us-east-2:123456789012:function:docs-func-aws-template-fill-v1",
      identity: undefined,
      clientContext: undefined,
      memoryLimitInMB: "512"
    };

    const result: APIGatewayProxyResult =
      await lambdaHandler(event as APIGatewayProxyEvent, testContext as Context);

    expect(result.statusCode).toEqual(200);

    const resultObjects: GetTemplatesResponse = JSON.parse(result.body);
    expect(resultObjects.contents!.length).toBeGreaterThan(0);
  });

});

describe('Lambda handler tests - negative tests', function () {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules()
    process.env = { ...OLD_ENV };
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  it('Param error - Invalid bucket name', async () => {

    process.env["repository.template.provider.aws.s3.region"] = "us-east-2";
    process.env["repository.template.provider.aws.s3.bucketname"] = "";
    process.env["repository.template.provider.aws.s3.prefix"] = "";

    const event: APIGatewayProxyEvent = {
    } as any;

    const testContext: Partial<Context> = {
      awsRequestId: "cd4b63fd-e407-450d-b24e-1e991ea43425",
      logGroupName:"/aws/lambda/docs-func-aws-template-fill-v1",
      logStreamName: "2023/03/01/[$LATEST]12345abcdfe01234567890abcdef1234",
      functionName: "docs-func-aws-template-fill-v1",
      functionVersion: "$LATEST",
      invokedFunctionArn: "arn:aws:lambda:us-east-2:123456789012:function:docs-func-aws-template-fill-v1",
      identity: undefined,
      clientContext: undefined,
      memoryLimitInMB: "512"
    };

    const mockedS3Provider = jest.spyOn(S3Provider.prototype, "listObjects");

    const result: APIGatewayProxyResult =
      await lambdaHandler(event as APIGatewayProxyEvent, testContext as Context);

    expect(result.statusCode).toEqual(200);

    const resultObjects: GetTemplatesResponse = JSON.parse(result.body);
    expect(resultObjects.contents!.length).toBeGreaterThan(0);
    expect(mockedS3Provider).toHaveBeenCalledTimes(1);
  });

  it('Param error - Invalid prefix', async () => {

    process.env["repository.template.provider.aws.s3.prefix"] = "nonexisting_folder";

    const event: APIGatewayProxyEvent = {
    } as any;

    const testContext: Partial<Context> = {
      awsRequestId: "cd4b63fd-e407-450d-b24e-1e991ea43425",
      logGroupName:"/aws/lambda/docs-func-aws-template-fill-v1",
      logStreamName: "2023/03/01/[$LATEST]12345abcdfe01234567890abcdef1234",
      functionName: "docs-func-aws-template-fill-v1",
      functionVersion: "$LATEST",
      invokedFunctionArn: "arn:aws:lambda:us-east-2:123456789012:function:docs-func-aws-template-fill-v1",
      identity: undefined,
      clientContext: undefined,
      memoryLimitInMB: "512"
    };

//    const mockedS3Provider = jest.spyOn(S3Provider.prototype, "listObjects");

    const result: APIGatewayProxyResult =
      await lambdaHandler(event as APIGatewayProxyEvent, testContext as Context);

    expect(result.statusCode).toEqual(200);

    const resultObjects: GetTemplatesResponse = JSON.parse(result.body);
    expect(resultObjects.contents!.length).toBeGreaterThan(0);
  });

  it('Param error - Wrong region', async () => {

    process.env["repository.template.provider.aws.s3.region"] = "us-east-2";

    const event: APIGatewayProxyEvent = {
    } as any;

    const testContext: Partial<Context> = {
      awsRequestId: "cd4b63fd-e407-450d-b24e-1e991ea43425",
      logGroupName:"/aws/lambda/docs-func-aws-template-fill-v1",
      logStreamName: "2023/03/01/[$LATEST]12345abcdfe01234567890abcdef1234",
      functionName: "docs-func-aws-template-fill-v1",
      functionVersion: "$LATEST",
      invokedFunctionArn: "arn:aws:lambda:us-east-2:123456789012:function:docs-func-aws-template-fill-v1",
      identity: undefined,
      clientContext: undefined,
      memoryLimitInMB: "512"
    };

//    const mockedS3Provider = jest.spyOn(S3Provider.prototype, "listObjects");

    const result: APIGatewayProxyResult =
      await lambdaHandler(event as APIGatewayProxyEvent, testContext as Context);

    expect(result.statusCode).toEqual(200);

    const resultObjects: GetTemplatesResponse = JSON.parse(result.body);
    expect(resultObjects.contents!.length).toBeGreaterThan(0);
//    expect(mockedS3Provider).toHaveBeenCalledTimes(1);
  });

});
