using System.Threading.Tasks;
using System.Net.Http;
namespace CalcWorker.Api
{
    public interface IApiClient
    {
        Task PostResultAsync(JobDTO job);
    }

    public class ApiClient : IApiClient
    {
        public ApiClient(IHttpClientFactory httpClientFactory)
        {
            
        }
        public Task PostResultAsync(JobDTO job)
        {
            throw new System.NotImplementedException();
        }
    }
}