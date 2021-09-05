import AWS from "aws-sdk";

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

export async function sendMessage(body: string) {
  return new Promise((resolve, reject) => {
    sqs.sendMessage(
      {
        QueueUrl: QUEUE_ENDPOINT,
        MessageBody: body,
      },
      (err, data) => {
        if (err) reject(err);
        else resolve(data);
      }
    );
  });
}
