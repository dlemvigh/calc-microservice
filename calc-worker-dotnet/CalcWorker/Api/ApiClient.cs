using System.Threading.Tasks;
using System.Net.Http;
using Newtonsoft.Json;
using System.Text;
using Microsoft.Extensions.Logging;
using CalcWorker.Config;
using System.Threading;
using Newtonsoft.Json.Serialization;

namespace CalcWorker.Api
{
    public interface IApiClient
    {
        Task<JobDTO> PostResultAsync(JobDTO job, CancellationToken cancellationToken = default);
    }

    public class ApiClient : IApiClient
    {
        private readonly IHttpClientFactory httpClientFactory;
        private readonly ILogger<ApiClient> logger;
        private readonly IEnvConfig config;
        private readonly JsonSerializerSettings jsonSerializerSettings;
        public ApiClient(IHttpClientFactory httpClientFactory, ILogger<ApiClient> logger, IEnvConfig config)
        {
            this.httpClientFactory = httpClientFactory;
            this.logger = logger;
            this.config = config;

            jsonSerializerSettings = new JsonSerializerSettings
            {
                NullValueHandling = NullValueHandling.Ignore,
                DateFormatHandling = DateFormatHandling.IsoDateFormat,
                ContractResolver = new DefaultContractResolver
                {
                    NamingStrategy = new CamelCaseNamingStrategy()
                }
            };

        }
        public async Task<JobDTO> PostResultAsync(JobDTO job, CancellationToken cancellationToken = default)
        {
            using (var httpClient = httpClientFactory.CreateClient())
            {
                var endpoint = $"{config.ApiEndpoint}/factorial/{job.Id}";
                var json = JsonConvert.SerializeObject(job, jsonSerializerSettings);
                var data = new StringContent(json, Encoding.UTF8, "application/json");
                logger.LogInformation($"PUT {data}");
                var res = await httpClient.PutAsync(endpoint, data, cancellationToken);
                return JsonConvert.DeserializeObject<JobDTO>(await res.Content.ReadAsStringAsync());
            }
        }

    }
}