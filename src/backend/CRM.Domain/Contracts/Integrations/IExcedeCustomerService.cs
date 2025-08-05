using System.Collections.Generic;
using System.Threading.Tasks;
using CRM.Domain.Models.Integrations;

namespace CRM.Domain.Contracts.Integrations
{
    public interface IExcedeCustomerService
    {
        Task<ExcedeCustomer> GetExcedeCustomer(string integrationId);
        Task<List<ExcedeCustomer>> GetExcedeCustomers();
        Task<string> GetExcedeAccessToken();
        
    }
}