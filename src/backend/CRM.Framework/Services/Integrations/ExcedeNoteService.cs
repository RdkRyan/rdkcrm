using CRM.Domain.Contracts.Configuration;
using CRM.Domain.Contracts.Integrations;
using CRM.Domain.Contracts.Services;
using CRM.Domain.Models.Integrations;

namespace CRM.Framework.Services.Integrations
{
    public class ExcedeNoteService : IExcedeNoteService
    {
        private readonly IAppSettings _configuration;
        private readonly IUserResolverService _userResolverService; 
        private readonly IExcedeEmployeeService _excedeEmployeeService;
        private readonly IExcedeCustomerService _excedeCustomerService;
        private readonly IExcedeNoteGateway _excedeNoteGateway;

        public ExcedeNoteService(IAppSettings configuration, IUserResolverService userResolverService, IExcedeCustomerService excedeCustomerService, IExcedeNoteGateway excedeNoteGateway)
        {
            _configuration = configuration;
            _userResolverService = userResolverService;
            _excedeCustomerService = excedeCustomerService;
            _excedeNoteGateway = excedeNoteGateway;
        }

        public async Task<ExcedeNote> AddAsync(ExcedeNote entity, string customerId)
        {
            var empEmail = _userResolverService.GetUserEmail();
            var employee = await _excedeEmployeeService.GetExcedeEmployeeByEmailAddress(empEmail);

            var excedeCustomer = await _excedeCustomerService.GetExcedeCustomer(customerId);

            string RandomString(int length)
            {
                var random = new Random();
                const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijkmnopqrstuvwxyz-0123456789!@#$%^&*()+={[}]|?<>~";
                return new string(Enumerable.Repeat(chars, length)
                    .Select(s => s[random.Next(s.Length)]).ToArray());
            }

            var excedeNote = new ExcedeNote()
            {
                Des = entity.Des,
                Important = 0,
                EmpId = employee.Id,
                EmpName = employee.NameLast + ", " + employee.NameFirst,
                NotId = excedeCustomer.NotId,
                Subject = "Customer",
                Password = RandomString(10)
            };

            var accessToken = await _excedeNoteGateway.GetExcedeAccessToken();
            var excedeNoteResponse = await _excedeNoteGateway.CreateExcedeNote(accessToken, excedeNote);

            return excedeNote;

            //return new CustomerNote()
            //{
            //    Id = excedeNoteResponse.Id,
            //    Body = excedeNoteResponse.Des,
            //    Active = true,
            //    CustomerId = entity.CustomerId,
            //    DateCreated = excedeNoteResponse.DateCreate,
            //    DateModified = excedeNoteResponse.DateUpdate,
            //    UserIdModified = entity.UserIdModified,
            //    UserNameModified = entity.UserNameModified
            //};
        }

        public async Task<ICollection<ExcedeNote>> GetByCustomerIdAsync(string customerId)
        {
            var excedeCustomer = await _excedeCustomerService.GetExcedeCustomer(customerId);
            var excedeNotes = await _excedeNoteGateway.GetExcedeNotes(await _excedeNoteGateway.GetExcedeAccessToken(), excedeCustomer.NotId);

            var customerNoteList = excedeNotes
                .Select(x => new ExcedeNote()
                {
                    Id = x.Id,
                    NotId = x.NotId,
                    Important = x.Important,
                    EmpId = x.EmpId,
                    EmpName = x.EmpName,
                    Password = x.Password,
                    DateCreate = x.DateCreate,
                    DateUpdate = x.DateUpdate,
                    Subject = x.Subject,
                    Des = x.Des,
                    TS = x.TS
                })
                .ToList();

            return customerNoteList;
        }
    }
}
