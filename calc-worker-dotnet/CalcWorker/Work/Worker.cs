using System;
using System.Threading.Tasks;
using CalcWorker.Api;
using CalcWorker.Config;
using CalcWorker.Queue;
using Microsoft.Extensions.Logging;

namespace CalcWorker.Work {
    public interface IWorker {
        Task DoWork();
    }

    public class Worker : IWorker {
        private readonly ILogger<Worker> logger;
        private readonly IEnvConfig config;
        private readonly IQueueClient queueClient;
        private readonly IApiClient apiClient;
        private readonly ICalculator calculator;

        public Worker(
            ILoggerFactory loggerFactory, 
            IEnvConfig config, 
            IQueueClient queueClient, 
            IApiClient apiClient, 
            ICalculator calculator
        ) {
            this.logger = loggerFactory.CreateLogger<Worker>();
            this.config = config;
            this.queueClient = queueClient;
            this.apiClient = apiClient;
            this.calculator = calculator;
        }

        public async Task DoWork() {
            logger.LogInformation("Receive message");
            var message = await queueClient.ReceiveMessageAsync();

            if (message == null) {
                logger.LogInformation("No messages");
                return;
            }

            var job = message.Job;
            job.CalcStartedAt = new DateTime();
            logger.LogInformation("Update job - calculation started");
            await apiClient.PostResultAsync(job);

            job.Output = calculator.Factorial(job.Input);
            job.FinishedAt = new DateTime();
            logger.LogInformation("Update job - calculation finished");
            await apiClient.PostResultAsync(job);

            await queueClient.DeleteMessageAsync(message);
        }

  }
}