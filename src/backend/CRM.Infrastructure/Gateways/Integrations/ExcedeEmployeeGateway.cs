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
    public class ExcedeEmployeeGateway: IExcedeEmployeeGateway
    {

        private readonly IAppSettings _configuration;
        private readonly ILogger<IExcedeCustomerGateway> _logger;
        private readonly IHttpClientFactory _httpClientFactory;

        public ExcedeEmployeeGateway(IAppSettings configuration, ILogger<IExcedeCustomerGateway> logger, IHttpClientFactory httpClientFactory)
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

        public async Task<List<ExcedeEmployee>> GetExcedeEmployees(string accessToken)
        {
            var client = _httpClientFactory.CreateClient("excedeapi");
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

            var myObject = (dynamic)new JObject();
            myObject.Where = $"Inactive=0";
            
            var postBody = new StringContent(myObject.ToString(), System.Text.Encoding.UTF8, "application/json");

            var excedeResponse = await client.PostAsync("search/employee", postBody);
            var excedeListJson = await excedeResponse.Content.ReadAsStringAsync();
            var excedeList = Newtonsoft.Json.JsonConvert.DeserializeObject<ResultSet<ExcedeEmployee>>(excedeListJson).Items;

            return excedeList;
        }

        public async Task<ExcedeEmployee> GetExcedeEmployeeById(string accessToken, string id)
        {
            var client = _httpClientFactory.CreateClient("excedeapi");
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

            var myObject = (dynamic)new JObject();
            myObject.Where = $"Id==\"{id}\"";
            
            var postBody = new StringContent(myObject.ToString(), System.Text.Encoding.UTF8, "application/json");

            var excedeResponse = await client.PostAsync("search/employee", postBody);
            var excedeJson = await excedeResponse.Content.ReadAsStringAsync();
            var employee = Newtonsoft.Json.JsonConvert.DeserializeObject<ResultSet<ExcedeEmployee>>(excedeJson).Items.Single();

            return employee;
        }

        public async Task<ExcedeEmployee> GetExcedeEmployeeByEmailAddress(string accessToken, string emailAddress)
        {
            var client = _httpClientFactory.CreateClient("excedeapi");

            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

            var myObject = (dynamic)new JObject();
            myObject.Where = $"email==\"{emailAddress}\"";
            myObject.OrderBy = "";
            myObject.Limit = 1;
            myObject.Skip = 0;

            var postBody = new StringContent(myObject.ToString(), System.Text.Encoding.UTF8, "application/json");
            var response = await client.PostAsync("search/employee", postBody);
            var responseString = await response.Content.ReadAsStringAsync();
            var resultSet = Newtonsoft.Json.JsonConvert.DeserializeObject<ResultSet<ExcedeEmployee>>(responseString);

            return resultSet.Items.SingleOrDefault();
        }
    }
}