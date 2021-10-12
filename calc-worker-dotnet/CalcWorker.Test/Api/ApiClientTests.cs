using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging.Abstractions;
using Moq;
using Moq.Contrib.HttpClient;
using NUnit.Framework;
using CalcWorker.Api;
using CalcWorker.Config;

namespace CalcWorker.Test.Api {
	public class ApiClientTests {
		[Test]
		public async Task PostResultAsyncTest() {
			// arrange
			var endpoint = "http://some-endpoint.io:1234";
			var job = new JobDTO {
				Id = 42,
			};

			var httpClientFactory = new Mock<IHttpClientFactory>();
			var handler = new Mock<HttpMessageHandler>();
			httpClientFactory
				.Setup(x => x.CreateClient(It.IsAny<string>()))
				.Returns(() => handler.CreateClient());
			handler
				.SetupRequest(HttpMethod.Put, $"{endpoint}/factorial/{job.Id}", async request => {
					var json = await request.Content.ReadAsStringAsync();
					return json == "{\"Id\":42}";
				})
				.ReturnsResponse("{ \"id\": 42 }");

			var logger = new NullLogger<ApiClient>();

			var config = new EnvConfig {
				ApiEndpoint = endpoint
			};

			// act
			var apiClient = new ApiClient(httpClientFactory.Object, logger, config);
			var res = await apiClient.PostResultAsync(job);			

			// assert
			Assert.AreEqual(job.Id, res.Id);
			handler.VerifyAnyRequest(Times.Once());
		}
	}
}