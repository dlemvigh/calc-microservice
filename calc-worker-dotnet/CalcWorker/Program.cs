using System;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using CalcWorker.Work;
using CalcWorker.Queue;

namespace CalcWorker
{
    class Program
    {
        static void Main(string[] args)
        {
            var services = DependencyInjection.ConfigureServices();

            var logger = services.GetService<ILoggerFactory>().CreateLogger<Program>();
            logger.LogInformation("Worker started");

            var calc = services.GetService<ICalculator>();
            var input = 7;
            var output = calc.Factorial(input);
            logger.LogInformation($"{input}! = {output}");

            var queueClient = services.GetService<IQueueClient>();
            var message = queueClient.ReceiveMessageAsync().GetAwaiter().GetResult();
            if (message != null)
            {
                Console.WriteLine("message" + message.Body);
            }
            else
            {
                Console.WriteLine("no messages");
            }

            Console.WriteLine(""); // Flush console
        }
    }
}
