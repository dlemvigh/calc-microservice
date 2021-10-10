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
        Task PostResultAsync(JobDTO job);
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
        public async Task PostResultAsync(JobDTO job)
        {
            using (var httpClient = httpClientFactory.CreateClient())
            {
                var endpoint = $"{config.ApiEndpoint}/factorial/{job.Id}";
                var json = JsonConvert.SerializeObject(job);
                var data = new StringContent(json, Encoding.UTF8, "application/json");
                logger.LogInformation($"PUT {data}");
                await httpClient.PutAsync(endpoint, data);
            }
        }
    }
}