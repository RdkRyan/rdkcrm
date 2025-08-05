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
                new { id = 1, name = "Innovate Corp", firstName = "SHULTZ", lastName = "ROBERT", email = "robert.shultz@innovatecorp.com", phoneWork = "18139731354" },
                new { id = 2, name = "Global Solutions Inc", firstName = "SULLIVAN", lastName = "TIMOTHY", email = "timothy.sullivan@globalsolutions.com", phoneWork = "18139731355" },
                new { id = 3, name = "Tech Innovations Ltd", firstName = "ADAMS", lastName = "JENNIFER", email = "jennifer.adams@techinnovations.com", phoneWork = "18139731356" },
                new { id = 4, name = "NextGen Systems", firstName = "SHULTZ", lastName = "ROBERT", email = "robert.shultz@nextgensystems.com", phoneWork = "18139731357" },
                new { id = 5, name = "Alpha Enterprises", firstName = "SULLIVAN", lastName = "TIMOTHY", email = "timothy.sullivan@alphaent.com", phoneWork = "18139731358" },
                new { id = 6, name = "Beta Solutions", firstName = "JACKSON", lastName = "DAVID", email = "david.jackson@betasolutions.com", phoneWork = "18139731359" },
                new { id = 7, name = "Central Services Group", firstName = "ADAMS", lastName = "JENNIFER", email = "jennifer.adams@centralservices.com", phoneWork = "18139731360" },
                new { id = 8, name = "Dynamic Tech Inc", firstName = "SULLIVAN", lastName = "TIMOTHY", email = "timothy.sullivan@dynamictech.com", phoneWork = "18139731361" },
                new { id = 9, name = "Elite Global", firstName = "SHULTZ", lastName = "ROBERT", email = "robert.shultz@eliteglobal.com", phoneWork = "18139731362" },
                new { id = 10, name = "Fast Forward Systems", firstName = "JACKSON", lastName = "DAVID", email = "david.jackson@fastfwd.com", phoneWork = "18139731363" },
                new { id = 11, name = "Apex Solutions", firstName = "SULLIVAN", lastName = "TIMOTHY", email = "timothy.sullivan@apexsolutions.com", phoneWork = "18139731364" },
                new { id = 12, name = "Bridgepoint Tech", firstName = "ADAMS", lastName = "JENNIFER", email = "jennifer.adams@bridgepoint.com", phoneWork = "18139731365" },
                new { id = 13, name = "Core Innovations", firstName = "SHULTZ", lastName = "ROBERT", email = "robert.shultz@coreinnovations.com", phoneWork = "18139731366" },
                new { id = 14, name = "Evergreen Services", firstName = "JACKSON", lastName = "DAVID", email = "david.jackson@evergreenservices.com", phoneWork = "18139731367" },
                new { id = 15, name = "First Class Group", firstName = "SULLIVAN", lastName = "TIMOTHY", email = "timothy.sullivan@firstclass.com", phoneWork = "18139731368" },
                new { id = 16, name = "Greenlight Solutions", firstName = "SULLIVAN", lastName = "TIMOTHY", email = "timothy.sullivan@greenlight.com", phoneWork = "18139731369" },
                new { id = 17, name = "Horizon Tech", firstName = "ADAMS", lastName = "JENNIFER", email = "jennifer.adams@horizontech.com", phoneWork = "18139731370" },
                new { id = 18, name = "Innovate Solutions", firstName = "SHULTZ", lastName = "ROBERT", email = "robert.shultz@innovatesolutions.com", phoneWork = "18139731371" },
                new { id = 19, name = "Junction Technologies", firstName = "JACKSON", lastName = "DAVID", email = "david.jackson@junctiontech.com", phoneWork = "18139731372" },
                new { id = 20, name = "Kinetic Enterprises", firstName = "SULLIVAN", lastName = "TIMOTHY", email = "timothy.sullivan@kineticent.com", phoneWork = "18139731373" }
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

        [HttpGet("calllogs")]
        [Authorize(Policy = "ReadReportsPolicy")]
        public IActionResult GetEmployeeCallLogs()
        {
            _logger.LogInformation("Authorized access to call logs endpoint.");

            // Hardcoded employee extension for this example
            const string employeeExtension = "107";
            var rawCallLogs = GetFakeCallLogs();

            // Transform the data to include customer and employee names
            var callLogReport = rawCallLogs
                .Where(log => log.DestinationExtension == employeeExtension || log.SourceExtension == employeeExtension)
                .Select(log =>
                {
                    var employeeName = log.Direction == "Inbound" ? log.DestinationUserFullName : log.SourceUserFullName;

                    return new CallLogReport
                    {
                        Id = log.Id,
                        Direction = log.Direction == "Inbound" ? "Incoming" : "Outgoing",
                        EmployeeName = _employeeLookup.GetValueOrDefault(employeeExtension, "Unknown Employee"),
                        CallLength = TimeSpan.FromSeconds(log.Length).ToString(@"hh\:mm\:ss"),
                        ToNumber = log.To,
                        FromNumber = log.From,
                        CustomerName = log.Direction == "Inbound" ? log.SourceUserFullName : log.DestinationUserFullName
                    };
                })
                .ToList();

            return Ok(callLogReport);
        }

        // This dictionary acts as a lookup for employee extensions to names.
        private readonly Dictionary<string, string> _employeeLookup = new()
        {
            {"107", "Kevin Hall"}
        };

        private IEnumerable<CallLog> GetFakeCallLogs()
        {
            return new List<CallLog>
            {
                // Fake Inbound Calls
                new CallLog { Id = "1", From = "18139731354", To = "107", Direction = "Inbound", Length = 6, Start = "2025-07-25 08:05:00", End = "2025-07-25 08:05:06", DestinationExtension = "107", DestinationUserFullName = "Kevin Hall", SourceUserFullName = "SHULTZ,ROBERT" },
                new CallLog { Id = "2", From = "18139731355", To = "107", Direction = "Inbound", Length = 15, Start = "2025-07-25 08:15:00", End = "2025-07-25 08:15:15", DestinationExtension = "107", DestinationUserFullName = "Kevin Hall", SourceUserFullName = "SULLIVAN,TIMOTHY" },
                new CallLog { Id = "3", From = "18139731356", To = "107", Direction = "Inbound", Length = 45, Start = "2025-07-25 08:30:00", End = "2025-07-25 08:30:45", DestinationExtension = "107", DestinationUserFullName = "Kevin Hall", SourceUserFullName = "ADAMS,JENNIFER" },
                new CallLog { Id = "4", From = "18139731357", To = "107", Direction = "Inbound", Length = 30, Start = "2025-07-25 09:00:00", End = "2025-07-25 09:00:30", DestinationExtension = "107", DestinationUserFullName = "Kevin Hall", SourceUserFullName = "SHULTZ,ROBERT" },
                new CallLog { Id = "5", From = "18139731358", To = "107", Direction = "Inbound", Length = 20, Start = "2025-07-25 09:45:00", End = "2025-07-25 09:45:20", DestinationExtension = "107", DestinationUserFullName = "Kevin Hall", SourceUserFullName = "SULLIVAN,TIMOTHY" },
                new CallLog { Id = "6", From = "18139731359", To = "107", Direction = "Inbound", Length = 50, Start = "2025-07-25 10:10:00", End = "2025-07-25 10:10:50", DestinationExtension = "107", DestinationUserFullName = "Kevin Hall", SourceUserFullName = "JACKSON,DAVID" },
                new CallLog { Id = "7", From = "18139731360", To = "107", Direction = "Inbound", Length = 12, Start = "2025-07-25 10:35:00", End = "2025-07-25 10:35:12", DestinationExtension = "107", DestinationUserFullName = "Kevin Hall", SourceUserFullName = "ADAMS,JENNIFER" },
                new CallLog { Id = "8", From = "18139731361", To = "107", Direction = "Inbound", Length = 35, Start = "2025-07-25 11:00:00", End = "2025-07-25 11:00:35", DestinationExtension = "107", DestinationUserFullName = "Kevin Hall", SourceUserFullName = "SULLIVAN,TIMOTHY" },
                new CallLog { Id = "9", From = "18139731362", To = "107", Direction = "Inbound", Length = 25, Start = "2025-07-25 11:30:00", End = "2025-07-25 11:30:25", DestinationExtension = "107", DestinationUserFullName = "Kevin Hall", SourceUserFullName = "SHULTZ,ROBERT" },
                new CallLog { Id = "10", From = "18139731363", To = "107", Direction = "Inbound", Length = 18, Start = "2025-07-25 12:00:00", End = "2025-07-25 12:00:18", DestinationExtension = "107", DestinationUserFullName = "Kevin Hall", SourceUserFullName = "JACKSON,DAVID" },
                new CallLog { Id = "11", From = "18139731364", To = "107", Direction = "Inbound", Length = 22, Start = "2025-07-25 12:45:00", End = "2025-07-25 12:45:22", DestinationExtension = "107", DestinationUserFullName = "Kevin Hall", SourceUserFullName = "SULLIVAN,TIMOTHY" },
                new CallLog { Id = "12", From = "18139731365", To = "107", Direction = "Inbound", Length = 40, Start = "2025-07-25 13:30:00", End = "2025-07-25 13:30:40", DestinationExtension = "107", DestinationUserFullName = "Kevin Hall", SourceUserFullName = "ADAMS,JENNIFER" },
                new CallLog { Id = "13", From = "18139731366", To = "107", Direction = "Inbound", Length = 10, Start = "2025-07-25 14:15:00", End = "2025-07-25 14:15:10", DestinationExtension = "107", DestinationUserFullName = "Kevin Hall", SourceUserFullName = "SHULTZ,ROBERT" },
                new CallLog { Id = "14", From = "18139731367", To = "107", Direction = "Inbound", Length = 55, Start = "2025-07-25 14:50:00", End = "2025-07-25 14:50:55", DestinationExtension = "107", DestinationUserFullName = "Kevin Hall", SourceUserFullName = "JACKSON,DAVID" },
                new CallLog { Id = "15", From = "18139731368", To = "107", Direction = "Inbound", Length = 19, Start = "2025-07-25 15:20:00", End = "2025-07-25 15:20:19", DestinationExtension = "107", DestinationUserFullName = "Kevin Hall", SourceUserFullName = "SULLIVAN,TIMOTHY" },
                
                // fake Outbound Calls
                new CallLog { Id = "16", From = "107", To = "18139731369", Direction = "Outbound", Length = 25, Start = "2025-07-25 08:40:00", End = "2025-07-25 08:40:25", SourceExtension = "107", SourceUserFullName = "Kevin Hall", DestinationUserFullName = "SULLIVAN,TIMOTHY" },
                new CallLog { Id = "17", From = "107", To = "18139731370", Direction = "Outbound", Length = 35, Start = "2025-07-25 09:15:00", End = "2025-07-25 09:15:35", SourceExtension = "107", SourceUserFullName = "Kevin Hall", DestinationUserFullName = "ADAMS,JENNIFER" },
                new CallLog { Id = "18", From = "107", To = "18139731371", Direction = "Outbound", Length = 18, Start = "2025-07-25 09:55:00", End = "2025-07-25 09:55:18", SourceExtension = "107", SourceUserFullName = "Kevin Hall", DestinationUserFullName = "SHULTZ,ROBERT" },
                new CallLog { Id = "19", From = "107", To = "18139731372", Direction = "Outbound", Length = 42, Start = "2025-07-25 10:25:00", End = "2025-07-25 10:25:42", SourceExtension = "107", SourceUserFullName = "Kevin Hall", DestinationUserFullName = "JACKSON,DAVID" },
                new CallLog { Id = "20", From = "107", To = "18139731373", Direction = "Outbound", Length = 14, Start = "2025-07-25 10:50:00", End = "2025-07-25 10:50:14", SourceExtension = "107", SourceUserFullName = "Kevin Hall", DestinationUserFullName = "SULLIVAN,TIMOTHY" },
                new CallLog { Id = "21", From = "107", To = "18139731374", Direction = "Outbound", Length = 28, Start = "2025-07-25 11:45:00", End = "2025-07-25 11:45:28", SourceExtension = "107", SourceUserFullName = "Kevin Hall", DestinationUserFullName = "ADAMS,JENNIFER" },
                new CallLog { Id = "22", From = "107", To = "18139731375", Direction = "Outbound", Length = 33, Start = "2025-07-25 12:15:00", End = "2025-07-25 12:15:33", SourceExtension = "107", SourceUserFullName = "Kevin Hall", DestinationUserFullName = "SHULTZ,ROBERT" },
                new CallLog { Id = "23", From = "107", To = "18139731376", Direction = "Outbound", Length = 21, Start = "2025-07-25 13:40:00", End = "2025-07-25 13:40:21", SourceExtension = "107", SourceUserFullName = "Kevin Hall", DestinationUserFullName = "JACKSON,DAVID" },
                new CallLog { Id = "24", From = "107", To = "18139731377", Direction = "Outbound", Length = 17, Start = "2025-07-25 14:30:00", End = "2025-07-25 14:30:17", SourceExtension = "107", SourceUserFullName = "Kevin Hall", DestinationUserFullName = "SULLIVAN,TIMOTHY" },
                new CallLog { Id = "25", From = "107", To = "18139731378", Direction = "Outbound", Length = 29, Start = "2025-07-25 15:10:00", End = "2025-07-25 15:10:29", SourceExtension = "107", SourceUserFullName = "Kevin Hall", DestinationUserFullName = "ADAMS,JENNIFER" },
                new CallLog { Id = "26", From = "107", To = "18139731379", Direction = "Outbound", Length = 48, Start = "2025-07-25 15:50:00", End = "2025-07-25 15:50:48", SourceExtension = "107", SourceUserFullName = "Kevin Hall", DestinationUserFullName = "SHULTZ,ROBERT" }
            };
        }

        public class CallLogReport
        {
            public string Id { get; set; }
            public string Direction { get; set; }
            public string EmployeeName { get; set; }
            public string CallLength { get; set; }
            public string ToNumber { get; set; }
            public string FromNumber { get; set; }
            public string CustomerName { get; set; }
        }

        private class CallLog
        {
            public string Id { get; set; }
            public string From { get; set; }
            public string To { get; set; }
            public string Direction { get; set; }
            public int Length { get; set; }
            public string Start { get; set; }
            public string End { get; set; }
            public string DestinationDeviceName { get; set; }
            public string SourceDeviceName { get; set; }
            public string DestinationUserFullName { get; set; }
            public string DestinationUser { get; set; }
            public string DestinationSipId { get; set; }
            public string DestinationExtension { get; set; }
            public string SourceUserFullName { get; set; }
            public string SourceExtension { get; set; }
        }
    }
}