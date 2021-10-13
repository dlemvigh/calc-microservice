using CalcWorker.Api;
using Newtonsoft.Json;

namespace CalcWorker.Queue
{
    public class MessageDTO
    {
        public string Body { get; set; }
        public string ReceiptHandle { get; set; }
        public JobDTO Job
        {
            get
            {
                return JsonConvert.DeserializeObject<JobDTO>(Body);
            }
            set
            {
                Body = JsonConvert.SerializeObject(value);
            }
        }
    }
}