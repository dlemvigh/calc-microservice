using System;
using System.Threading;
using System.Threading.Tasks;
using CalcWorker.Config;
using Microsoft.Extensions.Logging;

namespace CalcWorker.Work
{
    public interface IConsoleWorkerLoop
    {
        Task StartWorkLoop();
    }

    public class ConsoleWorkerLoop : IConsoleWorkerLoop
    {
        private readonly ILogger<IConsoleWorkerLoop> logger;
        private readonly IWorkerLoop workerLoop;
        public ConsoleWorkerLoop(IWorkerLoop workerLoop, ILogger<IConsoleWorkerLoop> logger)
        {
            this.workerLoop = workerLoop;
            this.logger = logger;
        }
        public async Task StartWorkLoop()
        {
            var cts = new CancellationTokenSource();

            logger.LogInformation("Press escape to cancel.");
            Console.CancelKeyPress += (s, e) =>
            {
                logger.LogInformation("Cancelling...");
                cts.Cancel();
                e.Cancel = true;
            };

            await workerLoop.Work(cts.Token);
        }
    }
}