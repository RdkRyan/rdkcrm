using System.Collections.Generic;
using System.Threading.Tasks;
using CRM.Domain.Contracts.Gateways;
using CRM.Domain.Contracts.Services;
using CRM.Domain.Models.Integrations;

namespace CRM.Framework.Services.Integrations
{
    public class ExcedeCompanyControlService: IReadOnlyService<ExcedeCompanyControl>
    {
        private readonly IReadOnlyGateway<ExcedeCompanyControl> _gateway;
        
        public ExcedeCompanyControlService(IReadOnlyGateway<ExcedeCompanyControl> gateway)
        {
            _gateway = gateway;
        }
        
        public async Task<ICollection<ExcedeCompanyControl>> GetAllAsync(string accessToken)
        {
            return await _gateway.GetAllAsync(accessToken);
        }

        public async Task<ExcedeCompanyControl> GetAsyncById(string accessToken, string id)
        {
            return await _gateway.GetAsyncById(accessToken, id);
        }
    }
}