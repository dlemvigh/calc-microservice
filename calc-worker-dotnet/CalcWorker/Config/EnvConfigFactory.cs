using System;

namespace CalcWorker.Config
{
    public static class EnvVars
    {
        public const string SQS_ENDPOINT = nameof(SQS_ENDPOINT);
        public const string QUEUE_ENDPOINT = nameof(QUEUE_ENDPOINT);
        public const string API_ENDPOINT = nameof(API_ENDPOINT);
        public const string POLLING_INTERVAL = nameof(POLLING_INTERVAL);
    }

    public class EnvConfigFactory
    {
        public static EnvConfig Create()
        {
            return new EnvConfig
            {
                SqsEndpoint = Get(EnvVars.SQS_ENDPOINT, "http://localhost:9324"),
                QueueEndpoint = Get(EnvVars.QUEUE_ENDPOINT, "http://localhost:9324/queue/default"),
                ApiEndpoint = Get(EnvVars.API_ENDPOINT, "http://localhost:8081"),
                PollingInterval = Get(EnvVars.POLLING_INTERVAL, 1000)
            };
        }
        private static string Get(string name, string fallback) => Environment.GetEnvironmentVariable(name) ?? fallback;
        private static int Get(string name, int fallback)
        {
            var value = Environment.GetEnvironmentVariable(name);
            if (string.IsNullOrEmpty(value)) return fallback;
            return int.Parse(value);
        }
    }
}