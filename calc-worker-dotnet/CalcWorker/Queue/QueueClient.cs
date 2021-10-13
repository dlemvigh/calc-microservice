using System.Threading;
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
        Task<MessageDTO> ReceiveMessageAsync(CancellationToken cancellationToken = default);
        Task DeleteMessageAsync(MessageDTO messge, CancellationToken cancellationToken = default);
    }

    public class QueueClient : IQueueClient
    {
        private readonly IAmazonSQS sqsClient;
        private readonly IEnvConfig config;
        private readonly ILogger<QueueClient> logger;
        public QueueClient(IAmazonSQS sqsClient, ILogger<QueueClient> logger, IEnvConfig config)
        {
            this.sqsClient = sqsClient;
            this.logger = logger;
            this.config = config;
        }

        public async Task<MessageDTO> ReceiveMessageAsync(CancellationToken cancellationToken = default)
        {
            logger.LogInformation("Receive messages");
            logger.LogDebug(config.SqsEndpoint);
            logger.LogDebug(config.QueueEndpoint);
            var response = await sqsClient.ReceiveMessageAsync(new ReceiveMessageRequest
            {
                QueueUrl = config.QueueEndpoint,
                MaxNumberOfMessages = 1,

            }, cancellationToken);
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

        public async Task DeleteMessageAsync(MessageDTO message, CancellationToken cancellationToken = default)
        {
            logger.LogDebug("Delete message");
            await sqsClient.DeleteMessageAsync(config.QueueEndpoint, message.ReceiptHandle, cancellationToken);
            logger.LogDebug("Message deleted");
        }

    }
}