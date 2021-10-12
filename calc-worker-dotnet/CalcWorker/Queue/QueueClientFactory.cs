using Amazon.SQS;
using CalcWorker.Config;
using Microsoft.Extensions.Logging;

namespace CalcWorker.Queue
{
	public interface IQueueClientFactory
	{
		IQueueClient Create();
	}

	public class QueueClientFactory : IQueueClientFactory
	{
		private readonly IEnvConfig config;
		private readonly ILogger<QueueClient> logger;
		public QueueClientFactory(IEnvConfig config, ILogger<QueueClient> logger)
		{
			this.config = config;
			this.logger = logger;
		}

		public IQueueClient Create()
		{
			var sqsClient = new AmazonSQSClient(
				"notValidKey",
				"notValidSecret",
				new AmazonSQSConfig
				{
						ServiceURL = config.SqsEndpoint
				}
			);

			var queueClient = new QueueClient(sqsClient, logger, config);
			
			return queueClient;
		}
	}
}