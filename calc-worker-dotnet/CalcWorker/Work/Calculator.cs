using System;
using System.Numerics;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;

namespace CalcWorker.Work
{
    public interface ICalculator
    {
        BigInteger Factorial(int n, CancellationToken cancellationToken = default);
    }

    public class Calculator : ICalculator
    {
        private ILogger<Calculator> logger;
        public Calculator(ILogger<Calculator> logger)
        {
            this.logger = logger;
        }

        public BigInteger Factorial(int n, CancellationToken cancellationToken = default)
        {
            logger.LogInformation($"Calculation started: {n}!");
            if (n < 0)
            {
                throw new ArgumentOutOfRangeException("Cannot take factorial of negative numbers.", nameof(n));
            }

            var result = new BigInteger(1);

            for (var i = 2; i <= n; i++)
            {
                if (cancellationToken.IsCancellationRequested)
                {
                    throw new TaskCanceledException();
                }
                result *= i;
            }

            logger.LogInformation($"Calculation finished {n}! = {result}");

            return result;
        }
    }
}