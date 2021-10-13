using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using Moq;
using Moq.Contrib.HttpClient;
using NUnit.Framework;
using CalcWorker.Api;
using CalcWorker.Config;

namespace CalcWorker.Test.Api
{
    public class ApiClientTests
    {
        [Test]
        public async Task PostResultAsyncTest()
        {
            // arrange
            var endpoint = "http://some-endpoint.io:1234";
            var id = 42;

            var httpClientFactory = new Mock<IHttpClientFactory>();
            var handler = new Mock<HttpMessageHandler>();
            var logger = new TestLogger<ApiClient>();
            var config = new EnvConfig
            {
                ApiEndpoint = endpoint
            };

            httpClientFactory
                .Setup(x => x.CreateClient(It.IsAny<string>()))
                .Returns(() => handler.CreateClient());
            handler
                .SetupRequest(HttpMethod.Put, $"{endpoint}/factorial/{id}", async request =>
                {
                    var json = await request.Content.ReadAsStringAsync();
                    return json == "{\"Id\":42}";
                })
                .ReturnsResponse("{ \"id\": 42 }");


            // act
            var apiClient = new ApiClient(httpClientFactory.Object, logger, config);
            var res = await apiClient.PostResultAsync(new JobDTO { Id = id });

            // assert
            Assert.AreEqual(id, res.Id);
            handler.VerifyAnyRequest(Times.Once());
        }

        [Test]
        public void PostResultAsyncTest_CancelledRequest_DoesNothing()
        {
            // arrange
            var id = 42;
            var endpoint = "http://shoud-never-be-called.io";

            var httpClientFactory = new Mock<IHttpClientFactory>();
            var handler = new Mock<HttpMessageHandler>();
            var logger = new TestLogger<ApiClient>();
            var config = new EnvConfig
            {
                ApiEndpoint = endpoint
            };
            var cancellationToken = new CancellationToken(true);

            httpClientFactory
                .Setup(x => x.CreateClient(It.IsAny<string>()))
                .Returns(() => handler.CreateClient());
            handler
                .SetupRequest(HttpMethod.Put, $"{endpoint}/factorial/{id}", async request =>
                {
                    var json = await request.Content.ReadAsStringAsync();
                    return json == "{\"Id\":42}";
                })
                .ReturnsResponse("{ \"id\": 42 }")
                .Verifiable();

            // act
            var apiClient = new ApiClient(httpClientFactory.Object, logger, config);

            // assert
            Assert.ThrowsAsync<TaskCanceledException>(() => apiClient.PostResultAsync(new JobDTO { Id = id }, cancellationToken));
        }
    }
}