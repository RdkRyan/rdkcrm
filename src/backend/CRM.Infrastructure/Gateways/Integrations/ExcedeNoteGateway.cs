using System.Net;
using System.Net.Http.Headers;
using CRM.Domain.Contracts.Configuration;
using CRM.Domain.Contracts.Integrations;
using CRM.Domain.Models.Integrations;
using CRM.Shared;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json.Linq;

namespace CRM.Infrastructure.Gateways.Integrations
{
    public class ExcedeNoteGateway : IExcedeNoteGateway
    {
        private readonly IAppSettings _configuration;
        private readonly ILogger<IExcedeNoteGateway> _logger;
        private readonly IHttpClientFactory _httpClientFactory;
        
        public ExcedeNoteGateway(IAppSettings configuration, ILogger<IExcedeNoteGateway> logger, IHttpClientFactory httpClientFactory)
        {
            _configuration = configuration;
            _logger = logger;
            _httpClientFactory = httpClientFactory;
        }
        
        public async Task<List<ExcedeNote>> GetExcedeNotes(string accessToken, int notId)
        {
            var client = _httpClientFactory.CreateClient("excedeapi");
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

            var myObject = (dynamic)new JObject();
            myObject.Where = $"NotId=={notId}";
            myObject.OrderBy = "DateUpdate Desc";
            myObject.Limit = 999999;
            myObject.Skip = 0;
            var postBody = new StringContent(myObject.ToString(), System.Text.Encoding.UTF8, "application/json");

            var response = await client.PostAsync("search/note", postBody);
            var jsonList = await response.Content.ReadAsStringAsync();
            var excedeList = Newtonsoft.Json.JsonConvert.DeserializeObject<ResultSet<ExcedeNote>>(jsonList).Items;
            
            return excedeList;
        }

        public async Task<ExcedeNote> CreateExcedeNote(string accessToken, ExcedeNote excedeNote)
        {
            var excedeJson = Newtonsoft.Json.JsonConvert.SerializeObject(excedeNote);

            // now use the token to get data
            var client = _httpClientFactory.CreateClient("excedeapi");
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

            // post and inspect status code returned
            var postBody = new StringContent(excedeJson, System.Text.Encoding.UTF8, "application/json");
            var response = await client.PostAsync("note", postBody);
            var stringResponse = await response.Content.ReadAsStringAsync();

            if (response.StatusCode != HttpStatusCode.OK)
            {
                throw new Exception("Excede Note Post Failed:" + stringResponse);
            }

            return Newtonsoft.Json.JsonConvert.DeserializeObject<ExcedeNote>(stringResponse);
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