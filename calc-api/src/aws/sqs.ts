import AWS from "aws-sdk";
import { Config } from "../config";

export interface SqsClient {
  sendMessage: (body: string) => Promise<AWS.SQS.SendMessageResult>;
  sendJSON: (json: object) => Promise<AWS.SQS.SendMessageResult>;
} 

export function sqsClient(config: Config): SqsClient {
  AWS.config.update({
    region: "eu-central-1",
  });
  
  const sqs = new AWS.SQS({
    apiVersion: "2012-11-05",
    endpoint: config.SQS_ENDPOINT,
    accessKeyId: "notValidKey",
    secretAccessKey: "notValidSecret",
  });
  
  async function sendMessage(body: string): Promise<AWS.SQS.SendMessageResult> {
    return new Promise((resolve, reject) => {
      sqs.sendMessage(
        {
          QueueUrl: config.QUEUE_ENDPOINT,
          MessageBody: body,
        },
        (err, data) => {
          if (err) reject(err);
          else resolve(data);
        }
      );
    });
  }
  
  async function sendJSON(json: object): Promise<AWS.SQS.SendMessageResult> {
    const body = JSON.stringify(json);
    return await sendMessage(body);
  }  
  
  return { sendMessage, sendJSON };
}

