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
        public string SqsEndpoint { get; set; }

        public string QueueEndpoint { get; set; }

        public string ApiEndpoint { get; set; }

        public int PollingInterval { get; set; }
    }

}
