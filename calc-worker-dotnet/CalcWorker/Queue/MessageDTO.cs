using CalcWorker.Api;
using Newtonsoft.Json;

namespace CalcWorker.Queue
{
    public record MessageDTO
    {
        public string Body { get; init; }
        public string ReceiptHandle { get; init; }
        public JobDTO Job
        {
            get
            {
                return JsonConvert.DeserializeObject<JobDTO>(Body);
            }
            init
            {
                Body = JsonConvert.SerializeObject(value);
            }
        }
    }
}