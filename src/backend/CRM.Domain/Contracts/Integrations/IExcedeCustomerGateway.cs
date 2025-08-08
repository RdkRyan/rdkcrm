using CRM.Domain.Models.Integrations;
using CRM.Shared;

namespace CRM.Domain.Contracts.Integrations
{
    public interface IExcedeCustomerGateway
    {
        Task<string> GetExcedeAccessToken();
        Task<ExcedeCustomer> GetExcedeCustomer(string accessToken, string integrationId);
        Task<PaginatedResult<ExcedeCustomer>> GetExcedeCustomers(string accessToken, int limit = 50, int skip = 0, string filter = "", string orderBy = "");
        Task<PaginatedResult<ExcedeCustomer>> GetExcedeCustomers(string accessToken, int limit = 50, int skip = 0, string filter = "", string search  = "", string orderBy = "");
    }
}