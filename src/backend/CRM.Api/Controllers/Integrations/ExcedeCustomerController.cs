using CRM.Domain.Contracts.Integrations;
using CRM.Domain.Models.Integrations;
using CRM.Shared;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CRM.Api.Controllers.Integrations
{
    [ApiController]
    [Route("api/[controller]")]
    public class ExcedeCustomerController : Controller
    {
        private readonly IExcedeCustomerService _customerService;
        private ILogger<ExcedeCustomerController> _logger;
        private readonly IPaginatedList<ExcedeCustomer> _paginatedList;

        public ExcedeCustomerController(IExcedeCustomerService excedeCustomerService, ILogger<ExcedeCustomerController> logger, IPaginatedList<ExcedeCustomer> paginatedList)
        {
            _logger = logger;
            _customerService = excedeCustomerService;
            _paginatedList = paginatedList;
        }

        // todo: GetCustomers
        [Route("customers")]
        //[Authorize(Policy = "ReadContactsPolicy")]
        [HttpGet]
        public async Task<IPaginatedResult<ExcedeCustomer>> Get(int? page = 0, int? limit = 0)
        {
            var customers = await _customerService.GetExcedeCustomers();

            return _paginatedList.GetPaginatedList(customers, page ?? 0, limit ?? 0);
        }

        // todo:GetCustomerById
    }
}
