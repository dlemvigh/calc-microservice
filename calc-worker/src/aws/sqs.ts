import AWS from "aws-sdk";
import { Config } from "../config";
import { Job } from "../interfaces";

export interface SqsClient {
  receiveMessage(): Promise<AWS.SQS.Message & { json: Job }>;
  deleteMessage(message: AWS.SQS.Message): Promise<{}>;
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

  async function receiveMessage(): Promise<AWS.SQS.Message & { json: Job }> {
    return new Promise((resolve, reject) => {
      sqs.receiveMessage(
        {
          QueueUrl: config.QUEUE_ENDPOINT,
          MaxNumberOfMessages: 1,
        },
        (err, data) => {
          if (err) return reject(err);
          if (!data?.Messages?.length) return reject("No data");
          const [message] = data.Messages;
          if (!message.Body) return reject("No body");
          return resolve({
            ...message,
            json: JSON.parse(message.Body),
          });
        }
      );
    });
  }

  async function deleteMessage(message: AWS.SQS.Message): Promise<{}> {
    return new Promise((resolve, reject) => {
      sqs.deleteMessage(
        {
          QueueUrl: config.QUEUE_ENDPOINT,
          ReceiptHandle: message.ReceiptHandle!,
        },
        (err, data) => {
          if (err) return reject(err);
          resolve(data);
        }
      );
    });
  }
  return { receiveMessage, deleteMessage };
}
