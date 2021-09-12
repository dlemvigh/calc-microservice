import AWS, { SQS } from "aws-sdk";
import { Job } from "../interfaces";

const SQS_ENDPOINT = process.env.SQS_ENDPOINT || "http://localhost:9324";
const QUEUE_ENDPOINT =
  process.env.QUEUE_ENDPOINT || "http://localhost:9324/queue/default";

AWS.config.update({
  region: "eu-central-1",
});
const sqs = new AWS.SQS({
  apiVersion: "2012-11-05",
  endpoint: SQS_ENDPOINT,
  accessKeyId: "notValidKey",
  secretAccessKey: "notValidSecret",
});

export async function receiveMessage(): Promise<SQS.Message & { json: Job }> {
  return new Promise((resolve, reject) => {
    sqs.receiveMessage(
      {
        QueueUrl: QUEUE_ENDPOINT,
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

export async function deleteMessage(message: SQS.Message) {
  return new Promise((resolve, reject) => {
    sqs.deleteMessage(
      {
        QueueUrl: QUEUE_ENDPOINT,
        ReceiptHandle: message.ReceiptHandle!,
      },
      (err, data) => {
        if (err) return reject(err);
        resolve(data);
      }
    );
  });
}
