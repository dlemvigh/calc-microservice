using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Amazon.SQS;
using Amazon.SQS.Model;
using CalcWorker.Config;
using CalcWorker.Queue;
using Microsoft.Extensions.Logging.Abstractions;
using Moq;
using NUnit.Framework;

namespace CalcWorker.Test.Queue {
	public class QueueClientTests {
		[Test]
		public async Task ReceiveMessageAsyncTest_NoMessages_ShouldReturnNull() {
			// arrange
			var sqsClient = new Mock<IAmazonSQS>();
			var logger = new NullLogger<QueueClient>();
			var config = new EnvConfig {
				QueueEndpoint = "http://some-queue.io/my/queue",
			};

			sqsClient
				.Setup<Task<ReceiveMessageResponse>>(x => 
					x.ReceiveMessageAsync(
						It.Is<ReceiveMessageRequest>(req => req.QueueUrl == config.QueueEndpoint), 
						It.IsAny<CancellationToken>()))
				.ReturnsAsync(new ReceiveMessageResponse{
					Messages = new List<Message>() {}
				})
				.Verifiable();

			// act
			var client = new QueueClient(sqsClient.Object, logger, config);
			var message = await client.ReceiveMessageAsync();

			// assert			
			Assert.IsNull(message);
			sqsClient.Verify();
		}

		[Test]
		public async Task ReceiveMessageAsyncTest_WithMessages_ShouldReturnJobDTO() {
			// arrange
			var messageBody = "{ id: 42, input: 5 }";

			var sqsClient = new Mock<IAmazonSQS>();
			var logger = new NullLogger<QueueClient>();
			var config = new EnvConfig {
				QueueEndpoint = "http://some-queue.io/my/queue",
			};

			sqsClient
				.Setup<Task<ReceiveMessageResponse>>(x => 
					x.ReceiveMessageAsync(
						It.Is<ReceiveMessageRequest>(req => req.QueueUrl == config.QueueEndpoint), 
						It.IsAny<CancellationToken>()))
				.ReturnsAsync(new ReceiveMessageResponse{
					Messages = new List<Message>() {
						new Message {
							Body = messageBody
						}
					}
				})
				.Verifiable();

			// act
			var client = new QueueClient(sqsClient.Object, logger, config);
			var message = await client.ReceiveMessageAsync();

			// assert			
			Assert.NotNull(message);
			Assert.AreEqual(messageBody, message.Body);
			Assert.AreEqual(42, message.Job.Id);
			Assert.AreEqual(5, message.Job.Input);
			Assert.AreEqual(null, message.Job.Output);
			Assert.AreEqual(null, message.Job.CalcStartedAt);
			Assert.AreEqual(null, message.Job.FinishedAt);
			sqsClient.Verify();
		}

	}
}