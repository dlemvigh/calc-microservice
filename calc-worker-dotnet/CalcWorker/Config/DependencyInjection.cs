using System;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using CalcWorker.Api;
using CalcWorker.Work;
using CalcWorker.Queue;

namespace CalcWorker.Config
{
    public class DependencyInjection
    {
        public static IServiceProvider ConfigureServices()
        {

            var services = new ServiceCollection();

            // Configure your services here
            services.AddSingleton<IApiClient, ApiClient>();
            services.AddSingleton<ICalculator, Calculator>();
            services.AddSingleton<IQueueClientFactory, QueueClientFactory>();
            services.AddSingleton<IEnvConfig>(EnvConfigFactory.Create());
            services.AddLogging(logConfig =>
                logConfig.AddSimpleConsole(formatConfig =>
                {
                    formatConfig.SingleLine = true;
                    formatConfig.TimestampFormat = "[hh:mm:ss] ";
                })
            );
            services.AddHttpClient();

            var serviceProvider = services.BuildServiceProvider();
            return serviceProvider;
        }
    }
}