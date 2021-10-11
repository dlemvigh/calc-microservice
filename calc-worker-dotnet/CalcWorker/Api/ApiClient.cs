using System.Threading.Tasks;
using System.Net.Http;
using Newtonsoft.Json;
using System.Text;
using Microsoft.Extensions.Logging;
using CalcWorker.Config;

namespace CalcWorker.Api
{
    public interface IApiClient
    {
        Task<JobDTO> PostResultAsync(JobDTO job);
    }

    public class ApiClient : IApiClient
    {
        private readonly IHttpClientFactory httpClientFactory;
        private readonly ILogger<ApiClient> logger;
        private readonly IEnvConfig config;
        public ApiClient(IHttpClientFactory httpClientFactory, ILoggerFactory loggerFactory, IEnvConfig config)
        {
            this.httpClientFactory = httpClientFactory;
            this.logger = loggerFactory.CreateLogger<ApiClient>();
            this.config = config;
        }
        public async Task<JobDTO> PostResultAsync(JobDTO job)
        {
            using (var httpClient = httpClientFactory.CreateClient())
            {
                var endpoint = $"{config.ApiEndpoint}/factorial/{job.Id}";
                var jsonSettings = new JsonSerializerSettings { 
                    NullValueHandling = NullValueHandling.Ignore,
                };
                var json = JsonConvert.SerializeObject(job, jsonSettings);
                var data = new StringContent(json, Encoding.UTF8, "application/json");
                logger.LogInformation($"PUT {data}");
                var res = await httpClient.PutAsync(endpoint, data);
                return JsonConvert.DeserializeObject<JobDTO>(await res.Content.ReadAsStringAsync());
            }
        }
    }
}