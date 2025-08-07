using CRM.Domain.Contracts.Integrations;
using CRM.Domain.Models.Integrations;
using CRM.Shared;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CRM.Api.Controllers.Integrations
{
    [ApiController]
    [Route("api/[controller]")]
    public class CustomerController : Controller
    {
        private readonly IExcedeCustomerService _customerService;
        private ILogger<CustomerController> _logger;

        public CustomerController(IExcedeCustomerService excedeCustomerService, ILogger<CustomerController> logger)
        {
            _logger = logger;
            _customerService = excedeCustomerService;
        }

        // todo: GetCustomers
        [Route("customers")]
        //[Authorize(Policy = "ReadContactsPolicy")]
        [HttpGet]
        public async Task<ActionResult<PaginatedResponse<ExcedeCustomer>>> Get(
            int? page = 0,
            int limit = 50,
            string orderBy = "dateUpdate desc")
        {
            int safeLimit = Math.Min(limit, 50);
            int currentPage = page ?? 0;
            int skip = currentPage * safeLimit;

            var paginatedResult = await _customerService.GetExcedeCustomers(safeLimit, skip, orderBy);

            var response = new PaginatedResponse<ExcedeCustomer>
            {
                Items = paginatedResult.Items,
                Metadata = new PaginationMetadata
                {
                    Page = paginatedResult.Page,
                    Limit = paginatedResult.Limit,
                    TotalCount = paginatedResult.TotalCount,
                    TotalPages = paginatedResult.TotalPages
                }
            };

            return Ok(response);
        }

        // todo:GetCustomerById

        [Route("customer/{id}")]
        //[Authorize(Policy = "ReadContactsPolicy")]
        [HttpGet]
        public async Task<ExcedeCustomer> GetById(string id)
        {
            var customer = await _customerService.GetExcedeCustomer(id);

            return customer;
        }
    }
}
