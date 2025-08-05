using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using CRM.Domain.Contracts.Configuration;
using CRM.Domain.Contracts.Integrations;
using CRM.Domain.Models;
using CRM.Domain.Models.Integrations;
using CRM.Shared;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace CRM.Infrastructure.Gateways.Integrations
{
    /// <summary>
    /// class to communicate with another web api
    /// </summary>
    public class ExcedeCustomerGateway : IExcedeCustomerGateway
    {
        private readonly IAppSettings _configuration;
        private ILogger<IExcedeCustomerGateway> _logger;
        private readonly IHttpClientFactory _httpClientFactory;
        
        public ExcedeCustomerGateway(IAppSettings configuration, ILogger<IExcedeCustomerGateway> logger, IHttpClientFactory httpClientFactory)
        {
            _configuration = configuration;
            _logger = logger;
            _httpClientFactory = httpClientFactory;
        }
        
        public async Task<ExcedeCustomer> GetExcedeCustomer(string accessToken, string integrationId)
        {
            try
            {
                var client = _httpClientFactory.CreateClient("excedeapi");

                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

                var myObject = (dynamic)new JObject();
                myObject.Where = $"Id==\"{integrationId}\"";
                myObject.OrderBy = "";
                myObject.Limit = 1;
                myObject.Skip = 0;

                var postBody = new StringContent(myObject.ToString(), System.Text.Encoding.UTF8, "application/json");
                var response = await client.PostAsync("search/customer", postBody);
                var responseString = await response.Content.ReadAsStringAsync();
                var resultSet = Newtonsoft.Json.JsonConvert.DeserializeObject<ResultSet<ExcedeCustomer>>(responseString);

                return resultSet.Items.SingleOrDefault();
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public async Task<List<ExcedeCustomer>> GetExcedeCustomers(string accessToken)
        {          
            var client = _httpClientFactory.CreateClient("excedeapi");
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

            var myObject = (dynamic)new JObject();
            myObject.OrderBy = "";
            myObject.Limit = 20;
            myObject.Skip = 0;
            var postBody = new StringContent(myObject.ToString(), System.Text.Encoding.UTF8, "application/json");

            var excedeResponse = await client.PostAsync("search/customer", postBody);
            var excedeCustomerListJson = await excedeResponse.Content.ReadAsStringAsync();
            var excedeCustomerList = Newtonsoft.Json.JsonConvert.DeserializeObject<ResultSet<ExcedeCustomer>>(excedeCustomerListJson).Items;
            
            return excedeCustomerList;
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
