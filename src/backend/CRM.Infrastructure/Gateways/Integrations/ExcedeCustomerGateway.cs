using CRM.Domain.Contracts.Configuration;
using CRM.Domain.Contracts.Integrations;
using CRM.Domain.Models.Integrations;
using CRM.Shared;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Net.Http.Headers;
using System.Runtime.Caching;
using System.Text;

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

        public async Task<PaginatedResult<ExcedeCustomer>> GetExcedeCustomers(string accessToken, int limit = 50, int skip = 0, string filter = "", string orderBy = "")
        {
            if (limit > 50)
                limit = 50;

            var client = _httpClientFactory.CreateClient("excedeapi");
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

            var requestBody = new JObject
            {
                ["Where"] = filter ?? "",
                ["OrderBy"] = orderBy ?? "",
                ["Limit"] = limit,
                ["Skip"] = skip
            };

            var postBody = new StringContent(requestBody.ToString(), Encoding.UTF8, "application/json");

            var response = await client.PostAsync("search/customer", postBody);
            response.EnsureSuccessStatusCode();

            var responseJson = await response.Content.ReadAsStringAsync();
            var resultSet = JsonConvert.DeserializeObject<ResultSet<ExcedeCustomer>>(responseJson);

            int page = (limit == 0) ? 0 : skip / limit;
            int totalPages = (limit == 0) ? 0 : (int)Math.Ceiling((double)resultSet.TotalItems / limit);

            return new PaginatedResult<ExcedeCustomer>
            {
                Items = resultSet.Items,
                Limit = limit,
                Page = page,
                TotalCount = resultSet.TotalItems,
                TotalPages = totalPages
            };
        }

        public async Task<PaginatedResult<ExcedeCustomer>> GetExcedeCustomers(
            string accessToken,
            int limit = 50,
            int skip = 0,
            string filter = "",
            string search = "",
            string orderBy = "")
        {
            if (!string.IsNullOrWhiteSpace(search))
            {
                // 🧠 Use in-memory filtering with cache
                var cacheKey = "ExcedeCustomers_All";

                ObjectCache memoryCache = MemoryCache.Default;
                List<ExcedeCustomer> allCustomers;

                if (memoryCache.Contains(cacheKey))
                {
                    allCustomers = (List<ExcedeCustomer>)memoryCache.Get(cacheKey);
                }
                else
                {
                    // Pull all (up to 99,999)
                    var client = _httpClientFactory.CreateClient("excedeapi");
                    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

                    var requestBody = new JObject
                    {
                        ["Where"] = filter ?? "",
                        ["OrderBy"] = orderBy ?? "",
                        ["Limit"] = 99999,
                        ["Skip"] = 0
                    };

                    var postBody = new StringContent(requestBody.ToString(), Encoding.UTF8, "application/json");

                    var response = await client.PostAsync("search/customer", postBody);
                    response.EnsureSuccessStatusCode();

                    var responseJson = await response.Content.ReadAsStringAsync();
                    var resultSet = JsonConvert.DeserializeObject<ResultSet<ExcedeCustomer>>(responseJson);

                    allCustomers = resultSet.Items;

                    // Store in memory for 60 seconds
                    memoryCache.Set(
                        cacheKey,
                        allCustomers,
                        new CacheItemPolicy
                        {
                            AbsoluteExpiration = DateTimeOffset.Now.AddSeconds(60)
                        });
                }

                // 🧼 Perform case-insensitive "like" filter on Name
                var filtered = allCustomers
                    .Where(c => !string.IsNullOrWhiteSpace(c.Name) && c.Name.Contains(search, StringComparison.OrdinalIgnoreCase))
                    .ToList();

                // ⏳ Manual ordering (optional: extend to support multiple fields)
                if (!string.IsNullOrWhiteSpace(orderBy))
                {
                    filtered = filtered
                        .OrderByDynamic(orderBy) // you'll implement or plug this in below
                        .ToList();
                }

                // 🧮 Manual pagination
                var pagedItems = filtered.Skip(skip).Take(limit).ToList();
                int totalPages = (limit == 0) ? 0 : (int)Math.Ceiling((double)filtered.Count / limit);
                int page = (limit == 0) ? 0 : skip / limit;

                return new PaginatedResult<ExcedeCustomer>
                {
                    Items = pagedItems,
                    Limit = limit,
                    Page = page,
                    TotalCount = filtered.Count,
                    TotalPages = totalPages
                };
            }
            else
            {
                // 📡 Default server-side API call
                var client = _httpClientFactory.CreateClient("excedeapi");
                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

                var requestBody = new JObject
                {
                    ["Where"] = filter ?? "",
                    ["OrderBy"] = orderBy ?? "",
                    ["Limit"] = limit,
                    ["Skip"] = skip
                };

                var postBody = new StringContent(requestBody.ToString(), Encoding.UTF8, "application/json");

                var response = await client.PostAsync("search/customer", postBody);
                response.EnsureSuccessStatusCode();

                var responseJson = await response.Content.ReadAsStringAsync();
                var resultSet = JsonConvert.DeserializeObject<ResultSet<ExcedeCustomer>>(responseJson);

                int page = (limit == 0) ? 0 : skip / limit;
                int totalPages = (limit == 0) ? 0 : (int)Math.Ceiling((double)resultSet.TotalItems / limit);

                return new PaginatedResult<ExcedeCustomer>
                {
                    Items = resultSet.Items,
                    Limit = limit,
                    Page = page,
                    TotalCount = resultSet.TotalItems,
                    TotalPages = totalPages
                };
            }
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
