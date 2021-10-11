using System.Threading.Tasks;
using Amazon.SQS;
using Amazon.SQS.Model;
using CalcWorker.Api;
using CalcWorker.Config;
using Microsoft.Extensions.Logging;
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
        private readonly IAmazonSQS sqsClient;
        private readonly IEnvConfig config;
        private readonly ILogger<QueueClient> logger;
        public QueueClient(IAmazonSQS sqsClient, ILoggerFactory loggerFactory, IEnvConfig config)
        {
            this.sqsClient = sqsClient;
            this.logger = loggerFactory.CreateLogger<QueueClient>();
            this.config = config;
        }

        public async Task<MessageDTO> ReceiveMessageAsync()
        {
            logger.LogDebug("Receive messages");
            var response = await sqsClient.ReceiveMessageAsync(new ReceiveMessageRequest
            {
                QueueUrl = config.QueueEndpoint,
                MaxNumberOfMessages = 1,

            });
            logger.LogInformation($"Received {response.Messages.Count} message(s)");
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
            logger.LogDebug("Delete message");
            await sqsClient.DeleteMessageAsync(config.QueueEndpoint, message.ReceiptHandle);
            logger.LogDebug("Message deleted");
        }

    }
}