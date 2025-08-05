using System;
using System.Collections.Generic;
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
    public class ExcedeTimePunchGateway : IExcedeTimePunchGateway
    {
        private readonly IAppSettings _configuration;
        private readonly ILogger<ExcedeTimePunchGateway> _logger;
        private readonly IHttpClientFactory _httpClientFactory;

        public ExcedeTimePunchGateway(IAppSettings configuration, ILogger<ExcedeTimePunchGateway> logger, IHttpClientFactory httpClientFactory)
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

        public async Task<List<ExcedeEmployeePunch>> GetExcedeEmployeePunchesFromPreviousDayWithoutEndDates(string accessToken)
        {
            var client = _httpClientFactory.CreateClient("excedeapi");
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

            var previousDay = DateTime.Now.AddDays(-1);
            
            var myObject = (dynamic)new JObject();
            myObject.Where = $"DateEnd==null && DateStart.Year=={previousDay.Year} && DateStart.Month=={previousDay.Month} && DateStart.Day=={previousDay.Day}";
            myObject.OrderBy = "DateUpdate DESC";
            myObject.Limit = 100;
            myObject.Skip = 0;
            
            var postBody = new StringContent(myObject.ToString(), System.Text.Encoding.UTF8, "application/json");

            var response = await client.PostAsync("search/employee_punch", postBody);
            var listJson = await response.Content.ReadAsStringAsync();
            var list = Newtonsoft.Json.JsonConvert.DeserializeObject<ResultSet<ExcedeEmployeePunch>>(listJson).Items;

            return list;
        }

        public async Task<List<ExcedeCompanyShift>> GetExcedeCompanyShifts(string accessToken)
        {
            var client = _httpClientFactory.CreateClient("excedeapi");
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

            var myObject = (dynamic)new JObject();
            //myObject.Where = searchFilter;
            myObject.OrderBy = "";
            myObject.Limit = 999999;
            myObject.Skip = 0;
            
            var postBody = new StringContent(myObject.ToString(), System.Text.Encoding.UTF8, "application/json");

            var response = await client.PostAsync("search/company_shift", postBody);
            var listJson = await response.Content.ReadAsStringAsync();
            var list = Newtonsoft.Json.JsonConvert.DeserializeObject<ResultSet<ExcedeCompanyShift>>(listJson).Items;

            return list;
        }

        public async Task<List<ExcedeCompanyShiftEmployee>> GetExcedeCompanyShiftEmployees(string accessToken)
        {
            var client = _httpClientFactory.CreateClient("excedeapi");
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

            var myObject = (dynamic)new JObject();
            //myObject.Where = searchFilter;
            myObject.OrderBy = "";
            myObject.Limit = 999999;
            myObject.Skip = 0;
            
            var postBody = new StringContent(myObject.ToString(), System.Text.Encoding.UTF8, "application/json");

            var response = await client.PostAsync("search/company_shift_employee", postBody);
            var listJson = await response.Content.ReadAsStringAsync();
            var list = Newtonsoft.Json.JsonConvert.DeserializeObject<ResultSet<ExcedeCompanyShiftEmployee>>(listJson).Items;

            return list;
        }
    }
}