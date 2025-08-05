using System.Collections.Generic;
using System.Threading.Tasks;
using CRM.Domain.Models.Integrations;

namespace CRM.Domain.Contracts.Integrations
{
    public interface IExcedeCustomerGateway
    {
        Task<string> GetExcedeAccessToken();
        Task<ExcedeCustomer> GetExcedeCustomer(string accessToken, string integrationId);
        Task<List<ExcedeCustomer>> GetExcedeCustomers(string accessToken);
    }
}