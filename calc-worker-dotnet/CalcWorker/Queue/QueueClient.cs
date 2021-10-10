using System;
using System.Threading.Tasks;
using Amazon;
using Amazon.Runtime;
using Amazon.SQS;
using Amazon.SQS.Model;
using CalcWorker.Api;
using Newtonsoft.Json;

namespace CalcWorker.Queue
{
    public interface IQueueClient
    {
        Task<MessageDTO> ReceiveMessageAsync();
        Task DeleteMessageAsync(MessageDTO messge);
    }

    public class QueueClient : IQueueClient
    {
        private readonly AmazonSQSClient sqsClient;
        public QueueClient()
        {
            sqsClient = new AmazonSQSClient(
                "notValidKey",
                "notValidSecret",
                new AmazonSQSConfig
                {
                    ServiceURL = "http://localhost:9324"
                });

        }

        public async Task<MessageDTO> ReceiveMessageAsync()
        {
            var response = await sqsClient.ReceiveMessageAsync(new ReceiveMessageRequest
            {
                QueueUrl = "http://localhost:9324/queue/default",
                MaxNumberOfMessages = 1,

            });

            if (response.Messages.Count == 1)
            {
                var message = response.Messages[0];
                var job = JsonConvert.DeserializeObject<JobDTO>(message.Body);
                return new MessageDTO
                {
                    Body = message.Body,
                    ReceiptHandle = message.ReceiptHandle
                };
            }
            return null;
        }

        public async Task DeleteMessageAsync(MessageDTO message)
        {
            await sqsClient.DeleteMessageAsync("http://localhost:9324/queue/default", message.ReceiptHandle);
        }

    }
}