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
        public string SqsEndpoint { get; init; }

        public string QueueEndpoint { get; init; }

        public string ApiEndpoint { get; init; }

        public int PollingInterval { get; init; }
    }
}
