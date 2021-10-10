using System;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using CalcWorker.Api;
using CalcWorker.Work;
using CalcWorker.Queue;

public class DependencyInjection
{
    public static IServiceProvider ConfigureServices()
    {
        var services = new ServiceCollection();

        // Configure your services here
        services.AddSingleton<IApiClient, ApiClient>();
        services.AddSingleton<ICalculator, Calculator>();
        services.AddSingleton<IQueueClient, QueueClient>();

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