using System;
using System.Threading;
using System.Threading.Tasks;
using Moq;
using NUnit.Framework;
using CalcWorker.Api;
using CalcWorker.Queue;
using CalcWorker.Work;
using CalcWorker.Config;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Logging.Abstractions;

namespace CalcWorker.Test.Work
{
    [TestFixture]
    public class WorkerLoopTests
    {
        private ILogger<WorkerLoop> logger;
        private Mock<IWorker> worker;
        private EnvConfig config;


        [SetUp]
        public void Setup()
        {
            logger = new TestLogger<WorkerLoop>();
            worker = new Mock<IWorker>();
            config = new EnvConfig() { PollingInterval = 10 };
        }

        [Test]
        public async Task Work_NoWorkToDo_WaitsForWork()
        {
            // arrange
            var cts = new CancellationTokenSource();

            worker.Setup(x => x.Work(cts.Token)).ReturnsAsync(WorkStatus.NoWorkToDo).Verifiable();

            // act
            var workerLoop = new WorkerLoop(logger, worker.Object, config);
            var task = workerLoop.Work(cts.Token);

            await Task.Delay(100);
            cts.Cancel();

            // assert
            worker.Verify(x => x.Work(It.IsAny<CancellationToken>()), Times.Between(7, 11, Moq.Range.Inclusive));
        }

        [Test]
        public async Task Work_WorkInProgress_WaitsForWork()
        {
            // arrange
            var cts = new CancellationTokenSource();

            worker.Setup(x => x.Work(cts.Token)).ReturnsAsync(WorkStatus.WorkInProgress).Verifiable();

            // act
            var workerLoop = new WorkerLoop(logger, worker.Object, config);
            var task = workerLoop.Work(cts.Token);

            await Task.Delay(100);
            cts.Cancel();

            // assert
            worker.Verify(x => x.Work(It.IsAny<CancellationToken>()), Times.Between(7, 11, Moq.Range.Inclusive));
        }

        [Test]
        public async Task Work_Finished_DoesNotWaitForWork()
        {
            // arrange
            var cts = new CancellationTokenSource();

            worker.Setup(x => x.Work(cts.Token)).ReturnsAsync(WorkStatus.Finished).Verifiable();

            // act
            var workerLoop = new WorkerLoop(logger, worker.Object, config);

            var task = Task.Run(() => workerLoop.Work(cts.Token));

            await Task.Delay(100);
            cts.Cancel();

            // assert
            worker.Verify(x => x.Work(It.IsAny<CancellationToken>()), Times.AtLeast(20));
        }

    }
}