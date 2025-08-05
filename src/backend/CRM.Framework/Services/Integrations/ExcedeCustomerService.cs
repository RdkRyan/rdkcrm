using CRM.Domain.Contracts.Configuration;
using CRM.Domain.Contracts.Integrations;
using CRM.Domain.Models.Integrations;

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

        public async Task<List<ExcedeCustomer>> GetExcedeCustomers()
        {
            var accessToken = await _excedeCustomerGateway.GetExcedeAccessToken();
            return await _excedeCustomerGateway.GetExcedeCustomers(accessToken);
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