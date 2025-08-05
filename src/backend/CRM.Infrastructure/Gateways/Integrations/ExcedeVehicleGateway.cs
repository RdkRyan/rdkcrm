using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
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
    public class ExcedeVehicleGateway: IExcedeVehicleGateway
    {
        private readonly IAppSettings _configuration;
        private readonly ILogger<IExcedeCustomerGateway> _logger;
        private readonly IHttpClientFactory _httpClientFactory;

        public ExcedeVehicleGateway(IAppSettings configuration, ILogger<IExcedeCustomerGateway> logger, IHttpClientFactory httpClientFactory)
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

        public async Task<List<ExcedeVehicle>> GetExcedeVehicles(string accessToken, string searchFilter)
        {
            var client = _httpClientFactory.CreateClient("excedeapi");
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

            if (searchFilter == null || searchFilter.Trim() == string.Empty) searchFilter = "";
            
            var myObject = (dynamic)new JObject();
            myObject.Where = searchFilter;
            myObject.OrderBy = "";
            myObject.Limit = 999999;
            myObject.Skip = 0;
            
            var postBody = new StringContent(myObject.ToString(), System.Text.Encoding.UTF8, "application/json");

            var excedeResponse = await client.PostAsync("search/vehicle", postBody);
            var excedeVehicleListJson = await excedeResponse.Content.ReadAsStringAsync();
            var excedeVehicleList = Newtonsoft.Json.JsonConvert.DeserializeObject<ResultSet<ExcedeVehicle>>(excedeVehicleListJson).Items;

            return excedeVehicleList;
        }

        public async Task<ExcedeVehicle> GetExcedeVehicleById(string accessToken, string id)
        {
            var client = _httpClientFactory.CreateClient("excedeapi");

            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

            var myObject = (dynamic)new JObject();
            myObject.Where = $"Id==\"{id}\"";

            var postBody = new StringContent(myObject.ToString(), System.Text.Encoding.UTF8, "application/json");
            var response = await client.PostAsync("search/vehicle", postBody);
            var responseString = await response.Content.ReadAsStringAsync();
            var resultSet = Newtonsoft.Json.JsonConvert.DeserializeObject<ResultSet<ExcedeVehicle>>(responseString);

            return resultSet.Items.Single();
        }
    }
}