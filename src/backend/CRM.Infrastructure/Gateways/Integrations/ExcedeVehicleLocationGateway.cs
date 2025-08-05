using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using CRM.Domain.Contracts.Configuration;
using CRM.Domain.Contracts.Gateways;
using CRM.Domain.Models;
using CRM.Domain.Models.Integrations;
using CRM.Shared;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json.Linq;

namespace CRM.Infrastructure.Gateways.Integrations
{
    public class ExcedeVehicleLocationGateway : IReadOnlyGateway<ExcedeVehicleLocation>
    {
        private readonly IAppSettings _configuration;
        private readonly ILogger<ExcedeVehicleLocationGateway> _logger;
        private readonly IHttpClientFactory _httpClientFactory;

        public ExcedeVehicleLocationGateway(IAppSettings configuration, ILogger<ExcedeVehicleLocationGateway> logger, IHttpClientFactory httpClientFactory)
        {
            _configuration = configuration;
            _logger = logger;
            _httpClientFactory = httpClientFactory;
        }

        public async Task<ICollection<ExcedeVehicleLocation>> GetAllAsync(string accessToken)
        {
            var client = _httpClientFactory.CreateClient("excedeapi");
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

            var myObject = (dynamic) new JObject();
            myObject.OrderBy = "";
            myObject.Limit = 999999;
            myObject.Skip = 0;
            var postBody = new StringContent(myObject.ToString(), System.Text.Encoding.UTF8, "application/json");

            var excedeResponse = await client.PostAsync("search/vehicle_location", postBody);
            var excedeListJson = await excedeResponse.Content.ReadAsStringAsync();
            var excedeList = Newtonsoft.Json.JsonConvert.DeserializeObject<ResultSet<ExcedeVehicleLocation>>(excedeListJson).Items;

            return excedeList;
        }

        public async Task<ExcedeVehicleLocation> GetAsyncById(string accessToken, string id)
        {
            var client = _httpClientFactory.CreateClient("excedeapi");

            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

            var myObject = (dynamic)new JObject();
            myObject.Where = $"Id==\"{id}\"";

            var postBody = new StringContent(myObject.ToString(), System.Text.Encoding.UTF8, "application/json");
            var response = await client.PostAsync("search/vehicle_location", postBody);
            var responseString = await response.Content.ReadAsStringAsync();
            var resultSet = Newtonsoft.Json.JsonConvert.DeserializeObject<ResultSet<ExcedeVehicleLocation>>(responseString);

            return resultSet.Items.Single();
        }
    }
}