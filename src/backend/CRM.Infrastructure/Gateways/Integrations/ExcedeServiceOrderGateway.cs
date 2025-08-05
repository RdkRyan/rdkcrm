using System;
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
    public class ExcedeServiceOrderGateway: IExcedeServiceOrderGateway
    {
        private readonly IAppSettings _configuration;
        private readonly ILogger<IExcedeCustomerGateway> _logger;
        private readonly IHttpClientFactory _httpClientFactory;

        public ExcedeServiceOrderGateway(IAppSettings configuration, ILogger<IExcedeCustomerGateway> logger, IHttpClientFactory httpClientFactory)
        {
            _configuration = configuration;
            _logger = logger;
            _httpClientFactory = httpClientFactory;
        }
        
        public async Task<List<ExcedeServiceOrder>> GetExcedeServiceOrders(string accessToken)
        {
            var client = _httpClientFactory.CreateClient("excedeapi");
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

            var searchFilter = "Status.Equals(752) && Id.StartsWith(\"R\")";
            
            var myObject = (dynamic)new JObject();
            myObject.Where = searchFilter;
            myObject.OrderBy = "";
            myObject.Limit = 999999;
            myObject.Skip = 0;
            
            var postBody = new StringContent(myObject.ToString(), System.Text.Encoding.UTF8, "application/json");

            var excedeResponse = await client.PostAsync("search/service_order_header", postBody);
            var excedeVehicleListJson = await excedeResponse.Content.ReadAsStringAsync();
            var excedeVehicleList = Newtonsoft.Json.JsonConvert.DeserializeObject<ResultSet<ExcedeServiceOrder>>(excedeVehicleListJson).Items;

            return excedeVehicleList;
        }

        public async Task<ExcedeServiceOrder> GetExcedeServiceOrder(string accessToken, string integrationId)
        {
            var client = _httpClientFactory.CreateClient("excedeapi");
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

            var searchFilter = $"Id.Equals(\"{integrationId}\")";
            
            var myObject = (dynamic)new JObject();
            myObject.Where = searchFilter;
            myObject.OrderBy = "";
            myObject.Limit = 999999;
            myObject.Skip = 0;
            
            var postBody = new StringContent(myObject.ToString(), System.Text.Encoding.UTF8, "application/json");
            var excedeResponse = await client.PostAsync("search/service_order_header", postBody);            
            var responseString = await excedeResponse.Content.ReadAsStringAsync();
            var resultSet = Newtonsoft.Json.JsonConvert.DeserializeObject<ResultSet<ExcedeServiceOrder>>(responseString);

            return resultSet.Items.SingleOrDefault();
        }

        public async Task<List<ExcedeServiceOrderOperation>> GetExcedeServiceOrderOperationsByServiceOrderId(string accessToken, string excedeServiceOrderId)
        {
            var client = _httpClientFactory.CreateClient("excedeapi");
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

            var myObject = (dynamic)new JObject();
            myObject.Where = $"SlsId==\"{excedeServiceOrderId}\"";
            myObject.OrderBy = "";
            myObject.Limit = 999999;
            myObject.Skip = 0;
            
            var postBody = new StringContent(myObject.ToString(), System.Text.Encoding.UTF8, "application/json");

            var excedeResponse = await client.PostAsync("search/service_order_operation", postBody);
            var excedeJson = await excedeResponse.Content.ReadAsStringAsync();
            var excedeList = Newtonsoft.Json.JsonConvert.DeserializeObject<ResultSet<ExcedeServiceOrderOperation>>(excedeJson).Items;

            return excedeList;
            
        }

        public async Task<ExcedeServiceOrderOperation> GetExcedeServiceOrderOperation(string accessToken, string integrationId)
        {
            var client = _httpClientFactory.CreateClient("excedeapi");
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

            var myObject = (dynamic)new JObject();
            myObject.Where = $"SlsId==\"{integrationId.Split('-')[0]}\" && OpsId={integrationId.Split('-')[1]}";
            myObject.OrderBy = "";
            myObject.Limit = 999999;
            myObject.Skip = 0;
            
            var postBody = new StringContent(myObject.ToString(), System.Text.Encoding.UTF8, "application/json");
            var excedeResponse = await client.PostAsync("search/service_order_operation", postBody);
            var excedeJson = await excedeResponse.Content.ReadAsStringAsync();
            var excedeItem = Newtonsoft.Json.JsonConvert.DeserializeObject<ResultSet<ExcedeServiceOrderOperation>>(excedeJson).Items.Single();

            return excedeItem;
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