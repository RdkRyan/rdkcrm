using CRM.Domain.Models.Integrations;
using CRM.Shared;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace CRM.Domain.Contracts.Integrations
{
    public interface IExcedeCustomerService
    {
        Task<ExcedeCustomer> GetExcedeCustomer(string integrationId);
        Task<PaginatedResult<ExcedeCustomer>> GetExcedeCustomers(int limit = 50, int skip = 0, string orderBy = "");
        Task<string> GetExcedeAccessToken();
        
    }
}