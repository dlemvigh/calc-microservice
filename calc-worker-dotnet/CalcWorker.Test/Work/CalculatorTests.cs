using System;
using CalcWorker.Work;
using NUnit.Framework;

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
            return Calculator.Factorial(n);
        }

        public void FactorialTest_ThrowsForNegativeNumbers()
        {
            Assert.Throws<ArgumentOutOfRangeException>(() => Calculator.Factorial(-1));
        }
    }
}