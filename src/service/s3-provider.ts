
import {
  ListObjectsV2Command,
  ListObjectsV2Output,
  ListObjectsV2Request,
  S3Client
} from "@aws-sdk/client-s3";
import {TemplateDocument} from "../gen/model/templateDocument";

export class S3Provider {
  protected _s3Client : any = {};
  private readonly _bucketName : string = "";
  private readonly _region : string = "";
  private readonly _basePath : string | undefined = "";

  constructor(bucketName?: string, region?: string, basePath?: string) {
    if (bucketName && region) {
      this._bucketName = bucketName;
      this._region = region;
    } else {
      throw new Error("Bucket name or region not specified.");
    }
    this._basePath = basePath;

    this._s3Client = new S3Client({ region: this._region });
  }


  get s3Client() : S3Client {
    return this._s3Client;
  }

  get bucketName(): string {
    return this._bucketName;
  }

  get region(): string {
    return this._region;
  }

  get basePath(): string | undefined {
    return this._basePath;
  }

  public async listObjects (s3Request: ListObjectsV2Request,
                                     allKeys: Array<TemplateDocument>): Promise<Array<TemplateDocument> | undefined> {

    console.debug("Retrieving bucket contexts...", JSON.stringify(s3Request, null, 2));

    try {
      const listCmd : ListObjectsV2Command = new ListObjectsV2Command(s3Request);
      const data: ListObjectsV2Output = await this.s3Client.send(listCmd);

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

        console.debug("get further list...");
        return this.listObjects(s3Request, allKeys);
      } else {
        console.debug("Retrieved items: ", JSON.stringify(allKeys, null, 2));

        return allKeys!;
      }
    } catch (error) {
      console.log(error);
      return [];
    }
  }
}

