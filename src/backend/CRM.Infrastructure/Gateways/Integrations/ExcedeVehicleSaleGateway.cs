using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using CRM.Domain.Contracts.Configuration;
using CRM.Domain.Contracts.Integrations;
using CRM.Domain.Models;
using CRM.Domain.Models.Integrations;
using CRM.Shared;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json.Linq;

namespace CRM.Infrastructure.Gateways.Integrations
{
    public class ExcedeVehicleSaleGateway: IExcedeVehicleSaleGateway
    {
        private readonly IAppSettings _configuration;
        private ILogger<IExcedeCustomerGateway> _logger;
        private readonly IHttpClientFactory _httpClientFactory;

        public ExcedeVehicleSaleGateway(IAppSettings configuration, ILogger<IExcedeCustomerGateway> logger, IHttpClientFactory httpClientFactory)
        {
            _configuration = configuration;
            _logger = logger;
            _httpClientFactory = httpClientFactory;
        }

        public async Task<List<ExcedeVehicleSale>> GetExcedeVehicleSales(string accessToken)
        {
            var client = _httpClientFactory.CreateClient("excedeapi");
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

            var myObject = (dynamic)new JObject();
            myObject.OrderBy = "";
            myObject.Limit = 999999;
            myObject.Skip = 0;

            var postBody = new StringContent(myObject.ToString(), System.Text.Encoding.UTF8, "application/json");

            var excedeResponse = await client.PostAsync("search/vehicle_sale_multiple_header", postBody);
            var excedeVehicleListJson = await excedeResponse.Content.ReadAsStringAsync();
            var excedeVehicleList = Newtonsoft.Json.JsonConvert.DeserializeObject<ResultSet<ExcedeVehicleSale>>(excedeVehicleListJson).Items;

            return excedeVehicleList;
        }
        
        public async Task<ExcedeVehicleSale> GetExcedeVehicleSale(string accessToken, string id)
        {
            var client = _httpClientFactory.CreateClient("excedeapi");

            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

            var myObject = (dynamic)new JObject();
            myObject.Where = $"id==\"{id}\"";

            var postBody = new StringContent(myObject.ToString(), System.Text.Encoding.UTF8, "application/json");
            var response = await client.PostAsync("search/vehicle_sale_multiple_header", postBody);
            var responseString = await response.Content.ReadAsStringAsync();
            var resultSet = Newtonsoft.Json.JsonConvert.DeserializeObject<ResultSet<ExcedeVehicleSale>>(responseString);

            return resultSet.Items.SingleOrDefault();
        }

        public async Task<List<ExcedeVehicleSale>> GetExcedeVehicleSalesByCustomerId(string accessToken, string customerId)
        {
            var client = _httpClientFactory.CreateClient("excedeapi");

            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

            var myObject = (dynamic)new JObject();
            myObject.Where = $"CusId==\"{customerId}\"";

            var postBody = new StringContent(myObject.ToString(), System.Text.Encoding.UTF8, "application/json");
            var response = await client.PostAsync("search/vehicle_sale_multiple_header", postBody);
            var responseString = await response.Content.ReadAsStringAsync();
            var resultSet = Newtonsoft.Json.JsonConvert.DeserializeObject<ResultSet<ExcedeVehicleSale>>(responseString).Items;

            return resultSet;
        }

        public async Task<List<ExcedeVehicleSaleItem>> GetExcedeVehicleSaleItems(string accessToken, string id)
        {
            var client = _httpClientFactory.CreateClient("excedeapi");
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

            var myObject = (dynamic)new JObject();
            myObject.OrderBy = "";
            myObject.Limit = 999999;
            myObject.Skip = 0;
            myObject.Where = $"SlsId==\"{id}\" && !VhItm.Equals(\"Commission\")";
            
            var postBody = new StringContent(myObject.ToString(), System.Text.Encoding.UTF8, "application/json");

            var excedeResponse = await client.PostAsync("search/vehicle_sale_multiple_vin_item", postBody);
            var excedeVehicleListJson = await excedeResponse.Content.ReadAsStringAsync();
            var excedeVehicleList = Newtonsoft.Json.JsonConvert.DeserializeObject<ResultSet<ExcedeVehicleSaleItem>>(excedeVehicleListJson).Items;

            return excedeVehicleList;
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
