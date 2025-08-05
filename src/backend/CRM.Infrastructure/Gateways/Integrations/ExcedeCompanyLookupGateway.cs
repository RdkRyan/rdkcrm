using System.Collections.Generic;
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
    public class ExcedeCompanyLookupGateway: IReadOnlyGateway<ExcedeCompanyLookup>
    {
        private readonly IAppSettings _configuration;
        private readonly ILogger<ExcedeCompanyLookupGateway> _logger;
        private readonly IHttpClientFactory _httpClientFactory;

        public ExcedeCompanyLookupGateway(IAppSettings configuration, ILogger<ExcedeCompanyLookupGateway> logger, IHttpClientFactory httpClientFactory)
        {
            _configuration = configuration;
            _logger = logger;
            _httpClientFactory = httpClientFactory;
        }
        
        public async Task<ICollection<ExcedeCompanyLookup>> GetAllAsync(string accessToken)
        {
            var client = _httpClientFactory.CreateClient("excedeapi");
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

            var myObject = (dynamic)new JObject(); 
            myObject.OrderBy = "";
            myObject.Limit = 999999;
            myObject.Skip = 0;
            var postBody = new StringContent(myObject.ToString(), System.Text.Encoding.UTF8, "application/json");

            var excedeResponse = await client.PostAsync("search/company_lookup", postBody);
            var excedeListJson = await excedeResponse.Content.ReadAsStringAsync();
            var excedeList = Newtonsoft.Json.JsonConvert.DeserializeObject<ResultSet<ExcedeCompanyLookup>>(excedeListJson).Items;

            return excedeList;
        }

        public Task<ExcedeCompanyLookup> GetAsyncById(string accessToken, string id)
        {
            throw new System.NotImplementedException();
        }
    }
}