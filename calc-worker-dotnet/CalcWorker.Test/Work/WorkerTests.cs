using System;
using NUnit.Framework;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Logging.Abstractions;
using CalcWorker.Work;
using System.Threading.Tasks;
using Moq;
using CalcWorker.Queue;
using CalcWorker.Api;

namespace CalcWorker.Test.Work
{
  public class WorkerTests {
      [Test]
      public async Task DoWork_WithNoMessages_DoesNothing()
      {
          // arrange
          var logger = new NullLogger<Worker>();
          var queueClient = new Mock<IQueueClient>();
          var apiClient = new Mock<IApiClient>();
          var calculator = new Mock<ICalculator>();
          var dateTimeProvider = new Mock<IDateTimeProvider>();

          queueClient
            .Setup(x => x.ReceiveMessageAsync())
            .Returns(Task.FromResult<MessageDTO>(null));

          // act
          var worker = new Worker(
            logger, 
            queueClient.Object, 
            apiClient.Object, 
            calculator.Object, 
            dateTimeProvider.Object
          );
          await worker.DoWork();

          // assert
          apiClient.Verify(x => x.PostResultAsync(It.IsAny<JobDTO>()), Times.Never);
          calculator.Verify(x => x.Factorial(It.IsAny<int>()), Times.Never);
          queueClient.Verify(x => x.DeleteMessageAsync(It.IsAny<MessageDTO>()), Times.Never);
      }
 
       [Test]
      public async Task DoWork_WithMessaes_DoesWork()
      {
          // arrange
          var id = 42;
          var input = 5;
          var output = -1; // mathematically wrong, but is a verification that actual calculator is not used
          var receiptHandle = "some-receipt-handle";

          var calculateTime = new DateTime(2020, 1, 1, 12, 0, 0);
          var finishTime = new DateTime(2020, 1, 1, 12, 5, 0);

          // var logger = new NullLogger<Worker>();
          var logger = new TestLogger<Worker>();
          var queueClient = new Mock<IQueueClient>();
          var apiClient = new Mock<IApiClient>();
          var calculator = new Mock<ICalculator>();
          var dateTimeProvider = new Mock<IDateTimeProvider>();

          queueClient
            .Setup(x => x.ReceiveMessageAsync())
            .ReturnsAsync(new MessageDTO {
              ReceiptHandle = receiptHandle,
              Job = new JobDTO {
                Id = id,
                Input = input
              }
            });

          calculator
            .Setup(x => x.Factorial(input))
            .Returns(output);

          dateTimeProvider
            .SetupSequence(x => x.Now)
            .Returns(calculateTime)
            .Returns(finishTime);

          var sequence = new MockSequence();
          apiClient
            .InSequence(sequence)
            .Setup(x => x.PostResultAsync(It.Is<JobDTO>(job => 
              job.Id == id && 
              job.Output == null &&
              job.CalcStartedAt == calculateTime &&
              job.FinishedAt == null
            )));
          apiClient
            .InSequence(sequence)
            .Setup(x => x.PostResultAsync(It.Is<JobDTO>(job => 
              job.Id == id && 
              job.Output == output &&
              job.CalcStartedAt == calculateTime &&
              job.FinishedAt == finishTime
            )));

          // act
          var worker = new Worker(
            logger, 
            queueClient.Object, 
            apiClient.Object, 
            calculator.Object, 
            dateTimeProvider.Object
          );
          await worker.DoWork();

          // assert
          queueClient.Verify(x => x.DeleteMessageAsync(It.Is<MessageDTO>(x => x.ReceiptHandle == receiptHandle)), Times.Once);
      }
  } 
}