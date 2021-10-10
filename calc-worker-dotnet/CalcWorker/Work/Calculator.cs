using System;

namespace CalcWorker.Work
{
    public interface ICalculator
    {
        long Factorial(int n);
    }

    public class Calculator : ICalculator
    {
        public long Factorial(int n)
        {
            if (n < 0)
            {
                throw new ArgumentOutOfRangeException("Cannot take factorial of negative numbers.", nameof(n));
            }

            long result = 1;

            for (var i = 2; i <= n; i++)
            {
                result *= i;
            }

            return result;
        }
    }
}