using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json.Linq;
using CRM.Domain.Contracts.Configuration;
using CRM.Domain.Contracts.Integrations;

namespace CRM.Infrastructure.Gateways.Integrations
{
    public class ExcedeAccessTokenGateway : IExcedeAccessTokenGateway
    {
        private readonly IAppSettings _configuration;
        private readonly ILogger<IExcedeAccessTokenGateway> _logger;
        private readonly IHttpClientFactory _httpClientFactory;

        public ExcedeAccessTokenGateway(IAppSettings configuration, ILogger<IExcedeAccessTokenGateway> logger, IHttpClientFactory httpClientFactory)
        {
            _configuration = configuration;
            _logger = logger;
            _httpClientFactory = httpClientFactory;
        }

        public async Task<string> GetExcedeAccessToken()
        {
            _logger.LogDebug("Start GetExcedeToken");

            var client = _httpClientFactory.CreateClient("excedeapi");

            // get an auth token
            var content = new StringContent(_configuration.ExcedeSettings.ApiToken, System.Text.Encoding.UTF8, "application/json");
            var result = await client.PostAsync("token", content);
            var token = await result.Content.ReadAsStringAsync();
            dynamic d = JObject.Parse(token);
            var accessToken = d.token.ToString();

            _logger.LogDebug("End GetExcedeToken");

            return accessToken;
        }
    }
}
