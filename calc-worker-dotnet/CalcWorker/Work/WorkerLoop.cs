using System.Threading;
using System.Threading.Tasks;
using CalcWorker.Config;
using Microsoft.Extensions.Logging;

namespace CalcWorker.Work
{
    public interface IWorkerLoop
    {
        Task Work(CancellationToken cancellationToken = default);
    }

    public class WorkerLoop : IWorkerLoop
    {
        private readonly ILogger<WorkerLoop> logger;
        private readonly IWorker worker;
        private readonly IEnvConfig config;
        public WorkerLoop(ILogger<WorkerLoop> logger, IWorker worker, IEnvConfig config)
        {
            this.logger = logger;
            this.worker = worker;
            this.config = config;
        }


        public async Task Work(CancellationToken cancellationToken = default)
        {
            var interval = config.PollingInterval;
            while (!cancellationToken.IsCancellationRequested)
            {
                var didWork = await worker.Work(cancellationToken);
                if (didWork == WorkStatus.NoWorkToDo || didWork == WorkStatus.WorkInProgress)
                {
                    logger.LogInformation($"No work to do, sleeping for {interval}ms");
                    await Task.Delay(interval);
                }
            }
        }
    }
}