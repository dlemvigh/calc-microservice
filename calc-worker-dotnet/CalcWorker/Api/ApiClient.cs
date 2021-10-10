using System.Threading.Tasks;
using System.Net.Http;
using Newtonsoft.Json;
using System.Text;

namespace CalcWorker.Api
{
    public interface IApiClient
    {
        Task PostResultAsync(JobDTO job);
    }

    public class ApiClient : IApiClient
    {
        private readonly IHttpClientFactory httpClientFactory;
        public ApiClient(IHttpClientFactory httpClientFactory)
        {
            this.httpClientFactory = httpClientFactory;
        }
        public async Task PostResultAsync(JobDTO job)
        {
            using (var httpClient = httpClientFactory.CreateClient())
            {
                var endpoint = $"http://localhost:8081/factorial/{job.Id}";
                var json = JsonConvert.SerializeObject(job);
                var data = new StringContent(json, Encoding.UTF8, "application/json");

                await httpClient.PutAsync(endpoint, data);
            }
        }
    }
}