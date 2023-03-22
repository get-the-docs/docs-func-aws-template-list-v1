/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Context doc: https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html
 * @param {Object} context
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 *
 */

import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context
} from 'aws-lambda';

import {
  GetTemplatesResponse,
  TemplateDocument
} from './gen/api';

import {
  S3Provider
} from './service/s3-provider';

export const lambdaHandler = async (event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> => {
  console.log(`Event: ${JSON.stringify(event, null, 2)}`);
  console.log(`Context: ${JSON.stringify(context, null, 2)}`);

  const region = process.env["repository.template.provider.aws.s3.region"]!;
  const bucketName = process.env["repository.template.provider.aws.s3.bucketname"]!;
  const prefix = process.env["repository.template.provider.aws.s3.prefix"]!;

  const s3Provider : S3Provider = new S3Provider(bucketName, region, prefix);

  console.debug(`Listing templates from bucket: s3://${s3Provider.bucketName}/${s3Provider.basePath}...`);

  const request: any = (event.body) ? JSON.parse(event.body!) : undefined;
  let templateId : string | undefined;
  if (request) {
    templateId = request.templateId;
  }

  const templateList: Array<TemplateDocument> | undefined =
    await s3Provider.listObjects ({
      Bucket: bucketName,
      Prefix: (templateId) ? prefix + '/' + templateId : prefix
    }, []);

  const resultObjects: GetTemplatesResponse = {
    contents: templateList
  };

  let result: APIGatewayProxyResult = { statusCode: 500, body: ""};
  if (templateList) {
    result = {
      statusCode: (templateList!.length > 0) ? 200 : 404,
      body: JSON.stringify(resultObjects),
    };
  }

  console.log(`End - Listing templates from bucket: s3://${s3Provider.bucketName}/${s3Provider.basePath}...`)
  return result;
};


