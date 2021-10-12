using System;
using NUnit.Framework;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Logging.Abstractions;
using CalcWorker.Work;

namespace CalcWorker.Test.Work
{
    public class CalculatorTests
    {
        [TestCase(0, ExpectedResult = 1)]
        [TestCase(1, ExpectedResult = 1)]
        [TestCase(2, ExpectedResult = 2)]
        [TestCase(3, ExpectedResult = 6)]
        [TestCase(4, ExpectedResult = 24)]
        [TestCase(5, ExpectedResult = 120)]
        public long FactorialTest(int n)
        {
            var logger = new NullLogger<Calculator>();
            var calculator = new Calculator(logger);
            return calculator.Factorial(n);
        }

        public void FactorialTest_ThrowsForNegativeNumbers()
        {
            var logger = new NullLogger<Calculator>();
            var calculator = new Calculator(logger);
            Assert.Throws<ArgumentOutOfRangeException>(() => calculator.Factorial(-1));
        }
    }
}