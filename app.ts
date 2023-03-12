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

import {APIGatewayEvent, APIGatewayProxyResultV2, Context} from 'aws-lambda';
import {GetTemplatesResponse, TemplateDocument} from './src/api';

import {S3} from "aws-sdk";

const s3 = new S3({ region: process.env["repository.template.provider.aws.s3.region"]! });

export const lambdaHandler = async (event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResultV2> => {
  console.log(`Event: ${JSON.stringify(event, null, 2)}`);
  console.log(`Context: ${JSON.stringify(context, null, 2)}`);

  const bucketName = process.env["repository.template.provider.aws.s3.bucketname"]!;
  const prefix = process.env["repository.template.provider.aws.s3.prefix"]!;

  console.debug(`Listing templates from bucket: s3://${bucketName}/${prefix}...`)

  const templateList: Array<TemplateDocument> = await listFilesFromS3 ({
      Bucket: bucketName,
      Prefix: prefix
    },
    []
  );

  const resultObjects: GetTemplatesResponse = {
    contents: templateList
  };

  return {
    statusCode: 200,
    body: JSON.stringify(resultObjects),
  };
};

export async function listFilesFromS3 (s3Request: S3.ListObjectsV2Request,
                                 allKeys: Array<TemplateDocument>): Promise<Array<TemplateDocument>> {

  console.info("Retrieving bucket contexts...", JSON.stringify(s3Request, null, 2));

  try {
    const data: S3.ListObjectsV2Output = await s3.listObjectsV2(s3Request).promise();
    let contents = data.Contents;

    console.debug("Items: ", data.KeyCount);

    if (contents) {
      contents.forEach(function (content) {
        if (content.Key) {
          const actDoc: TemplateDocument = {
            templateName: content.Key
          }
          allKeys.push(actDoc);
        }
      });
    }

    if (data.IsTruncated) {
      s3Request.ContinuationToken = data.NextContinuationToken;
      console.log("get further list...");
      return listFilesFromS3(s3Request, allKeys);
    } else {
      console.trace("Retrieved items: ", JSON.stringify(allKeys));

      return allKeys!;
    }
  } catch (error) {
    console.log(error);
    return [];
  }
}
