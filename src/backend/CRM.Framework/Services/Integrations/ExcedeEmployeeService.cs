using System.Collections.Generic;
using System.Threading.Tasks;
using CRM.Domain.Contracts.Integrations;
using CRM.Domain.Models.Integrations;

namespace CRM.Framework.Services.Integrations
{
    public class ExcedeEmployeeService: IExcedeEmployeeService
    {
        private readonly IExcedeEmployeeGateway _excedeEmployeeGateway;
        
        public ExcedeEmployeeService(IExcedeEmployeeGateway excedeEmployeeGateway)
        {
            _excedeEmployeeGateway = excedeEmployeeGateway;
        }
        
        public async Task<string> GetExcedeAccessToken()
        {
            return await _excedeEmployeeGateway.GetExcedeAccessToken();
        }

        public async Task<List<ExcedeEmployee>> GetExcedeEmployees(string accessToken)
        {
            return await _excedeEmployeeGateway.GetExcedeEmployees(accessToken);
        }

        public async Task<ExcedeEmployee> GetExcedeEmployeeByEmailAddress(string emailAddress)
        {
            return await _excedeEmployeeGateway.GetExcedeEmployeeByEmailAddress(await GetExcedeAccessToken(), emailAddress);
        }

        public async Task<ExcedeEmployee> GetExcedeEmployeeById(string accessToken, string id)
        {
            return await _excedeEmployeeGateway.GetExcedeEmployeeById(accessToken, id);
        }
    }
}