using System;
using Microsoft.Extensions.Logging;

namespace CalcWorker.Work
{
    public interface ICalculator
    {
        long Factorial(int n);
    }

    public class Calculator : ICalculator
    {
        private ILogger<Calculator> logger;
        public Calculator(ILoggerFactory loggerFactory)
        {
            logger = loggerFactory.CreateLogger<Calculator>();
        }

        public long Factorial(int n)
        {
            logger.LogInformation($"Calculation started: {n}!");
            if (n < 0)
            {
                throw new ArgumentOutOfRangeException("Cannot take factorial of negative numbers.", nameof(n));
            }

            long result = 1;

            for (var i = 2; i <= n; i++)
            {
                result *= i;
            }

            logger.LogInformation($"Calculation finished {n}! = {result}");

            return result;
        }
    }
}