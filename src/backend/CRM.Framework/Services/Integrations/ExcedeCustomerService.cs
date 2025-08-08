using CRM.Domain.Contracts.Configuration;
using CRM.Domain.Contracts.Integrations;
using CRM.Domain.Models.Integrations;
using CRM.Shared;

namespace CRM.Framework.Services.Integrations
{
    public class ExcedeCustomerService: IExcedeCustomerService
    {
        private readonly IAppSettings _configuration;
        private readonly IExcedeCustomerGateway _excedeCustomerGateway;

        public ExcedeCustomerService(IAppSettings configuration, IExcedeCustomerGateway excedeCustomerGateway)
        {
            _configuration = configuration;  
            _excedeCustomerGateway = excedeCustomerGateway;
        }

        public async Task<PaginatedResult<ExcedeCustomer>> GetExcedeCustomers(int limit = 50, int skip = 0, string filter = "", string search = "", string orderBy = "")
        {
            var accessToken = await _excedeCustomerGateway.GetExcedeAccessToken();

            if (search.Trim().Length > 0)
            {
                // we will need to get all the records and do a "like" search in memory
                return await _excedeCustomerGateway.GetExcedeCustomers(accessToken, limit, skip, filter, search, orderBy);

            }

            return await _excedeCustomerGateway.GetExcedeCustomers(accessToken, limit, skip, filter, orderBy);
        }

        public async Task<ExcedeCustomer> GetExcedeCustomer(string integrationId)
        {
            var accessToken = await _excedeCustomerGateway.GetExcedeAccessToken();
            return await _excedeCustomerGateway.GetExcedeCustomer(accessToken, integrationId);
        }

        public async Task<string> GetExcedeAccessToken()
        {
            return await _excedeCustomerGateway.GetExcedeAccessToken();
        }      
    }
}