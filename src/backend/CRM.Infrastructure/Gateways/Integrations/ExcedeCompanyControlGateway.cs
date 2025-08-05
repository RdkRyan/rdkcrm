using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using CRM.Domain.Contracts.Configuration;
using CRM.Domain.Contracts.Gateways;
using CRM.Domain.Contracts.Integrations;
using CRM.Domain.Models;
using CRM.Domain.Models.Integrations;
using CRM.Shared;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json.Linq;

namespace CRM.Infrastructure.Gateways.Integrations
{
    public class ExcedeCompanyControlGateway: IReadOnlyGateway<ExcedeCompanyControl>
    {
        private readonly IAppSettings _configuration;
        private readonly ILogger<IExcedeCustomerGateway> _logger;
        private readonly IHttpClientFactory _httpClientFactory;

        public ExcedeCompanyControlGateway(IAppSettings configuration, ILogger<IExcedeCustomerGateway> logger, IHttpClientFactory httpClientFactory)
        {
            _configuration = configuration;
            _logger = logger;
            _httpClientFactory = httpClientFactory;
        }
        
        public async Task<ICollection<ExcedeCompanyControl>> GetAllAsync(string accessToken)
        {
            var client = _httpClientFactory.CreateClient("excedeapi");
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

            var myObject = (dynamic)new JObject(); 
            myObject.OrderBy = "";
            myObject.Limit = 999999;
            myObject.Skip = 0;
            var postBody = new StringContent(myObject.ToString(), System.Text.Encoding.UTF8, "application/json");

            var excedeResponse = await client.PostAsync("search/company_control", postBody);
            var excedeListJson = await excedeResponse.Content.ReadAsStringAsync();
            var excedeList = Newtonsoft.Json.JsonConvert.DeserializeObject<ResultSet<ExcedeCompanyControl>>(excedeListJson).Items;

            return excedeList;
        }

        public Task<ExcedeCompanyControl> GetAsyncById(string accessToken, string id)
        {
            throw new System.NotImplementedException();
        }
    }
}