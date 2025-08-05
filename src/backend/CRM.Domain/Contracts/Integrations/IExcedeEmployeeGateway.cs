using System.Collections.Generic;
using System.Threading.Tasks;
using CRM.Domain.Models.Integrations;

namespace CRM.Domain.Contracts.Integrations
{
    public interface IExcedeEmployeeGateway
    {
        Task<string> GetExcedeAccessToken();
        Task<List<ExcedeEmployee>> GetExcedeEmployees(string accessToken);
        Task<ExcedeEmployee> GetExcedeEmployeeById(string accessToken, string id);
        Task<ExcedeEmployee> GetExcedeEmployeeByEmailAddress(string accessToken, string emailAddress);
    }
}