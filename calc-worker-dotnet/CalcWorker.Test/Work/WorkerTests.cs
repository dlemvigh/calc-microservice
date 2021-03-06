using System;
using System.Threading;
using System.Threading.Tasks;
using Moq;
using NUnit.Framework;
using CalcWorker.Api;
using CalcWorker.Queue;
using CalcWorker.Work;

namespace CalcWorker.Test.Work
{
    public class WorkerTests
    {
        [Test]
        public async Task Work_WithNoMessages_DoesNothing()
        {
            // arrange
            var logger = new TestLogger<Worker>();
            var queueClient = new Mock<IQueueClient>();
            var apiClient = new Mock<IApiClient>();
            var calculator = new Mock<ICalculator>();
            var dateTimeProvider = new Mock<IDateTimeProvider>();
            var cancellationToken = new CancellationToken();

            queueClient
              .Setup(x => x.ReceiveMessageAsync(cancellationToken))
              .Returns(Task.FromResult<MessageDTO>(null));

            // act
            var worker = new Worker(
              logger,
              queueClient.Object,
              apiClient.Object,
              calculator.Object,
              dateTimeProvider.Object
            );
            var didWork = await worker.Work(new CancellationToken());

            // assert
            Assert.AreEqual(WorkStatus.NoWorkToDo, didWork);
            apiClient.Verify(x => x.PostResultAsync(It.IsAny<JobDTO>(), It.IsAny<CancellationToken>()), Times.Never);
            calculator.Verify(x => x.Factorial(It.IsAny<int>(), It.IsAny<CancellationToken>()), Times.Never);
            queueClient.Verify(x => x.DeleteMessageAsync(
              It.IsAny<MessageDTO>(),
              It.IsAny<CancellationToken>()
            ), Times.Never);
        }

        [Test]
        public async Task Work_WithMessages_DoesWork()
        {
            // arrange
            var id = 42;
            var input = 5;
            var output = -1; // mathematically wrong, but is a verification that actual calculator is not used
            var receiptHandle = "some-receipt-handle";

            var calculateTime = new DateTime(2020, 1, 1, 12, 0, 0);
            var finishTime = new DateTime(2020, 1, 1, 12, 5, 0);

            // var logger = new TestLogger<Worker>();
            var logger = new TestLogger<Worker>();
            var queueClient = new Mock<IQueueClient>();
            var apiClient = new Mock<IApiClient>();
            var calculator = new Mock<ICalculator>();
            var dateTimeProvider = new Mock<IDateTimeProvider>();

            queueClient
              .Setup(x => x.ReceiveMessageAsync(
                It.IsAny<CancellationToken>())
              )
              .ReturnsAsync(new MessageDTO
              {
                  ReceiptHandle = receiptHandle,
                  Job = new JobDTO
                  {
                      Id = id,
                      Input = input
                  }
              });

            calculator
              .Setup(x => x.Factorial(input, It.IsAny<CancellationToken>()))
              .Returns(output);

            dateTimeProvider
              .SetupSequence(x => x.Now)
              .Returns(calculateTime)
              .Returns(finishTime);

            var sequence = new MockSequence();
            apiClient
              .InSequence(sequence)
              .Setup(x => x.PostResultAsync(
                It.Is<JobDTO>(job =>
                  job.Id == id &&
                  job.Output == null &&
                  job.CalcStartedAt == calculateTime &&
                  job.FinishedAt == null
                ),
                It.IsAny<CancellationToken>()
              ));
            apiClient
              .InSequence(sequence)
              .Setup(x => x.PostResultAsync(
                It.Is<JobDTO>(job =>
                  job.Id == id &&
                  job.Output == output.ToString() &&
                  job.CalcStartedAt == calculateTime &&
                  job.FinishedAt == finishTime
                ),
                It.IsAny<CancellationToken>()
              ));

            // act
            var worker = new Worker(
              logger,
              queueClient.Object,
              apiClient.Object,
              calculator.Object,
              dateTimeProvider.Object
            );
            var didWork = await worker.Work();

            // assert
            Assert.AreEqual(WorkStatus.Finished, didWork);
            queueClient.Verify(x => x.DeleteMessageAsync(
              It.Is<MessageDTO>(x => x.ReceiptHandle == receiptHandle),
              It.IsAny<CancellationToken>()
            ), Times.Once);
        }

        [Test]
        public async Task Work_WorkInprogress_DoesNothing()
        {
            // arrange
            var tcs = new TaskCompletionSource<MessageDTO>();

            var logger = new TestLogger<Worker>();
            var queueClient = new Mock<IQueueClient>();
            var apiClient = new Mock<IApiClient>();
            var calculator = new Mock<ICalculator>();
            var dateTimeProvider = new Mock<IDateTimeProvider>();

            queueClient.Setup(x => x.ReceiveMessageAsync(It.IsAny<CancellationToken>())).Returns(tcs.Task);

            // act
            var worker = new Worker(logger, queueClient.Object, apiClient.Object, calculator.Object, dateTimeProvider.Object);
            var task1 = worker.Work();
            var task2 = worker.Work();
            var didWork2 = await task2;
            tcs.TrySetResult(null);
            var didWork1 = await task1;

            // assert
            Assert.AreEqual(WorkStatus.NoWorkToDo, didWork1);
            Assert.AreEqual(WorkStatus.WorkInProgress, didWork2);
        }
    }
}