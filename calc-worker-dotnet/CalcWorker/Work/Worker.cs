using System;
using System.Threading;
using System.Threading.Tasks;
using CalcWorker.Api;
using CalcWorker.Queue;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;

namespace CalcWorker.Work
{
    public interface IWorker
    {
        Task<WorkStatus> Work(CancellationToken cancellationToken = default);
    }

    public class Worker : IWorker
    {
        private readonly ILogger<Worker> logger;
        private readonly IQueueClient queueClient;
        private readonly IApiClient apiClient;
        private readonly ICalculator calculator;
        private readonly IDateTimeProvider dateTimeProvider;

        public Worker(
            ILogger<Worker> logger,
            IQueueClient queueClient,
            IApiClient apiClient,
            ICalculator calculator,
            IDateTimeProvider dateTimeProvider
        )
        {
            this.logger = logger;
            this.queueClient = queueClient;
            this.apiClient = apiClient;
            this.calculator = calculator;
            this.dateTimeProvider = dateTimeProvider;
        }

        public bool IsWorking { get; private set; }

        public async Task<WorkStatus> Work(CancellationToken cancellationToken = default)
        {
            lock (this)
            {
                if (IsWorking)
                {
                    logger.LogInformation("Work is already in progress");
                    return WorkStatus.WorkInProgress;
                }
                IsWorking = true;
            }

            logger.LogInformation("Receive message");
            var message = await queueClient.ReceiveMessageAsync(cancellationToken);

            if (message == null)
            {
                logger.LogInformation("No messages");
                IsWorking = false;
                return WorkStatus.NoWorkToDo;
            }

            var job = message.Job;
            job.CalcStartedAt = dateTimeProvider.Now;
            if (!job.Input.HasValue)
            {
                throw new ArgumentException("Cannot calculater factorial without input value", nameof(job.Input));
            }

            logger.LogInformation("Update job - calculation started");
            logger.LogDebug(JsonConvert.SerializeObject(job));
            await apiClient.PostResultAsync(job, cancellationToken);

            job.Output = calculator.Factorial(job.Input.Value, cancellationToken).ToString();
            job.FinishedAt = dateTimeProvider.Now;
            logger.LogInformation("Update job - calculation finished");
            logger.LogDebug(JsonConvert.SerializeObject(job));
            await apiClient.PostResultAsync(job, cancellationToken);

            await queueClient.DeleteMessageAsync(message, cancellationToken);
            IsWorking = false;
            return WorkStatus.Finished;
        }
    }
}