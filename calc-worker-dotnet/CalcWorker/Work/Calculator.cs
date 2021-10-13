using System;
using System.Numerics;
using Microsoft.Extensions.Logging;

namespace CalcWorker.Work
{
    public interface ICalculator
    {
        BigInteger Factorial(int n);
    }

    public class Calculator : ICalculator
    {
        private ILogger<Calculator> logger;
        public Calculator(ILogger<Calculator> logger)
        {
            this.logger = logger;
        }

        public BigInteger Factorial(int n)
        {
            logger.LogInformation($"Calculation started: {n}!");
            if (n < 0)
            {
                throw new ArgumentOutOfRangeException("Cannot take factorial of negative numbers.", nameof(n));
            }

            var result = new BigInteger(1);

            for (var i = 2; i <= n; i++)
            {
                result *= i;
            }

            logger.LogInformation($"Calculation finished {n}! = {result}");

            return result;
        }
    }
}