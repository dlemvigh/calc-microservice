using System;
using Microsoft.Extensions.Logging;
using NUnit.Framework;

namespace CalcApi.Test
{
    class TestLogger<T> : ILogger<T>
    {
        public IDisposable BeginScope<TState>(TState state)
        {
            return default;
        }

        public bool IsEnabled(LogLevel logLevel)
        {
            return true;
        }

        public void Log<TState>(LogLevel logLevel, EventId eventId, TState state, Exception exception, Func<TState, Exception, string> formatter)
        {
            if (!IsEnabled(logLevel))
            {
                return;
            }
            TestContext.Out.WriteLine($"[{logLevel}] {formatter(state, exception)}");
        }
    }
}