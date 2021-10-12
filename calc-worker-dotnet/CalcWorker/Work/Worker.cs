using System;
using System.Threading.Tasks;
using CalcWorker.Api;
using CalcWorker.Config;
using CalcWorker.Queue;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;

namespace CalcWorker.Work {
    public interface IWorker {
        Task DoWork();
    }

    public class Worker : IWorker {
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
        ) {
            this.logger = logger;
            this.queueClient = queueClient;
            this.apiClient = apiClient;
            this.calculator = calculator;
            this.dateTimeProvider = dateTimeProvider;
        }

        public async Task DoWork() {
            logger.LogInformation("Receive message");
            var message = await queueClient.ReceiveMessageAsync();

            if (message == null) {
                logger.LogInformation("No messages");
                return;
            }

            var job = message.Job;
            job.CalcStartedAt = dateTimeProvider.Now;
            logger.LogInformation("Update job - calculation started");
            logger.LogDebug(JsonConvert.SerializeObject(job));
            await apiClient.PostResultAsync(job);

            if (!job.Input.HasValue) {
                throw new ArgumentException("Cannot calculater factorial without input value", nameof(job.Input));
            }
            job.Output = calculator.Factorial(job.Input.Value);
            job.FinishedAt = dateTimeProvider.Now;
            logger.LogInformation("Update job - calculation finished");
            logger.LogDebug(JsonConvert.SerializeObject(job));
            await apiClient.PostResultAsync(job);

            await queueClient.DeleteMessageAsync(message);
        }

  }
}