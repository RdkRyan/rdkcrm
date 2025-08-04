// This controller has two protected endpoints, each requiring a specific permission.

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace crm.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReportController : ControllerBase
    {
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly ILogger<ReportController> _logger;

        public ReportController(IHttpClientFactory httpClientFactory, ILogger<ReportController> logger)
        {
            _httpClientFactory = httpClientFactory;
            _logger = logger;
        }

        // This endpoint requires the 'read:contacts' permission.
        [HttpGet("contacts")]
        [Authorize(Policy = "ReadContactsPolicy")]
        public IActionResult GetContacts()
        {
            _logger.LogInformation("Authorized access to contacts endpoint.");
            // Simulate a database call to get CRM contacts
            var contacts = new[]
            {
                new { id = 1, name = "John Doe", email = "john.doe@example.com" },
                new { id = 2, name = "Jane Smith", email = "jane.smith@example.com" }
            };
            return Ok(contacts);
        }

        // This endpoint requires the 'read:reports' permission.
        [HttpGet("data")]
        [Authorize(Policy = "ReadReportsPolicy")]
        public async Task<IActionResult> GetReportData()
        {
            _logger.LogInformation("Authorized access to reports data endpoint.");
            try
            {
                var httpClient = _httpClientFactory.CreateClient();
                var externalApiUrl = "https://fakestoreapi.com/products";
                var response = await httpClient.GetAsync(externalApiUrl);

                if (response.IsSuccessStatusCode)
                {
                    var apiContent = await response.Content.ReadAsStringAsync();
                    var products = JsonSerializer.Deserialize<JsonElement>(apiContent);
                    return Ok(new { ExternalData = products, Message = "This is a secure report." });
                }
                else
                {
                    return StatusCode((int)response.StatusCode, new { Error = "Failed to retrieve data from external source." });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while fetching report data.");
                return StatusCode(500, new { Error = "An internal server error occurred." });
            }
        }
    }
}