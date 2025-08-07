using CRM.Domain.Models.Integrations;
using CRM.Shared;

namespace CRM.Domain.Contracts.Integrations
{
    public interface IExcedeCustomerGateway
    {
        Task<string> GetExcedeAccessToken();
        Task<ExcedeCustomer> GetExcedeCustomer(string accessToken, string integrationId);
        Task<PaginatedResult<ExcedeCustomer>> GetExcedeCustomers(string accessToken, int limit, int skip, string orderBy);
    }
}