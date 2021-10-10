using System;

namespace CalcWorker.Config
{
    public interface IEnvConfig
    {
        string SqsEndpoint { get; }
        string QueueEndpoint { get; }
        string ApiEndpoint { get; }
        int PollingInterval { get; }
    }

    public class EnvConfig : IEnvConfig
    {
        public string SqsEndpoint => Get(EnvVars.SQS_ENDPOINT, "http://locahost:9324");

        public string QueueEndpoint => Get(EnvVars.QUEUE_ENDPOINT, "http://localhost:9324/queue/default");

        public string ApiEndpoint => Get(EnvVars.API_ENDPOINT, "http://localhost:8081");
        public int PollingInterval => Get(EnvVars.POLLING_INTERVAL, 1000);

        // public int PollingInterval => 
        private string Get(string name, string fallback) => Environment.GetEnvironmentVariable(name) ?? fallback;
        private int Get(string name, int fallback)
        {
            var value = Environment.GetEnvironmentVariable(name);
            if (string.IsNullOrEmpty(value)) return fallback;
            return int.Parse(value);
        }
    }
    public static class EnvVars
    {
        public const string SQS_ENDPOINT = nameof(SQS_ENDPOINT);
        public const string QUEUE_ENDPOINT = nameof(QUEUE_ENDPOINT);
        public const string API_ENDPOINT = nameof(API_ENDPOINT);
        public const string POLLING_INTERVAL = nameof(POLLING_INTERVAL);
    }
}
