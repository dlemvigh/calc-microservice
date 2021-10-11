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
		private readonly ILoggerFactory loggerFactory;
		public QueueClientFactory(IEnvConfig config, ILoggerFactory loggerFactory)
		{
			this.config = config;
			this.loggerFactory = loggerFactory;
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

			var queueClient = new QueueClient(sqsClient, loggerFactory, config);
			
			return queueClient;
		}
	}
}