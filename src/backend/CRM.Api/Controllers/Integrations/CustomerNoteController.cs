using CRM.Domain.Contracts.Integrations;
using CRM.Domain.Contracts.Services;
using CRM.Domain.Models.Integrations;
using CRM.Framework.Services.Integrations;
using FluentValidation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CRM.WebApi.Controllers
{
    [ApiController]
    public class CustomerNoteController : Controller
    {
        private readonly IExcedeNoteService _excedeNoteService;
        private readonly IExcedeEmployeeService _excedeEmployeeService;
        private ILogger<CustomerNoteController> _logger;
		private IUserResolverService _userResolverService;
        private IValidator<ExcedeNote> _validator;

        public CustomerNoteController(IExcedeNoteService excedeNoteService, IExcedeEmployeeService excedeEmployeeService, ILogger<CustomerNoteController> logger, IUserResolverService userResolverService, IValidator<ExcedeNote> validator)
        {
            _logger = logger;
            _excedeNoteService = excedeNoteService;
            _excedeEmployeeService = excedeEmployeeService;
            _userResolverService = userResolverService;
            _validator = validator;
        }

        [Route("api/v1/customer/{customerId}/notes")]
        [Authorize(Policy = "AdminPolicy")] 
        [HttpGet]
        public async Task<ICollection<ExcedeNote>> Get(string customerId)
        {
            // TODO: testing only
            //var empEmail = _userResolverService.GetUserEmail();
            //var emp = await _excedeEmployeeService.GetExcedeEmployeeByEmailAddress(empEmail);
            return await _excedeNoteService.GetByCustomerIdAsync(customerId);
        }

        [Route("api/v1/customer/note")]
        [Authorize(Policy = "AdminPolicy")]
        [HttpPost]
        public async Task<ActionResult<ExcedeNote>> Post([FromBody] ExcedeNote customerNote, string customerId)
        {
            var customerNoteValidator = _validator.Validate(customerNote);
            
            if (!customerNoteValidator.IsValid && customerNoteValidator.Errors.Count > 0)
            {
                return UnprocessableEntity(string.Join(",", customerNoteValidator.Errors));
            }

            return await _excedeNoteService.AddAsync(customerNote, customerId);
        }
    }
}