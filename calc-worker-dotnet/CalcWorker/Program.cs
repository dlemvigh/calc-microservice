using System;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using CalcWorker.Config;
using CalcWorker.Queue;
using CalcWorker.Work;

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
            var input = new Random().Next(1, 7);
            var output = calc.Factorial(input);
            logger.LogInformation($"{input}! = {output}");

            Console.WriteLine(""); // Flush console
        }
    }
}
