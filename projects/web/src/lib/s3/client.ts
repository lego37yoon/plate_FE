import { AWS_ACCESS_KEY, AWS_SECRET_ACCESS_KEY, S3_ALIAS, S3_BUCKET, S3_ENDPOINT, S3_REGION } from "$env/static/private";
import { S3, type PutObjectRequest } from "@aws-sdk/client-s3";
import { Readable } from "node:stream";
import { ReadableStream } from "node:stream/web";

export default function ConnectStorageProvider(path: string | null = ""): S3 {
  return new S3({
    apiVersion: "latest",
    region: S3_REGION,
    endpoint: `${S3_ENDPOINT}/${path}`,
    credentials: {
      accessKeyId: AWS_ACCESS_KEY,
      secretAccessKey: AWS_SECRET_ACCESS_KEY
    },
    requestStreamBufferSize: 64 * 1024
  })
}

export async function UploadObject(file: File, name: string, path: string | null): Promise<string> {

  return new Promise<string>(async (resolve, reject) => {
    const s3: S3 = ConnectStorageProvider(path);
    const params: PutObjectRequest = {
      Bucket: S3_BUCKET,
      Key: name,
      Body: Readable.fromWeb(file.stream() as ReadableStream<any>),
      ContentType: file.type,
      ContentLength: file.size
    };

    try {
      await s3.putObject(params);
      resolve(`${S3_ALIAS}/${path}/${name}`);
    } catch (err) {
      reject(err);
    }
  });
}