using System.Collections.Generic;
using System.Threading.Tasks;
using CRM.Domain.Contracts.Gateways;
using CRM.Domain.Contracts.Services;
using CRM.Domain.Models.Integrations;

namespace CRM.Framework.Services.Integrations
{
    public class ExcedeCompanyLookupService: IReadOnlyService<ExcedeCompanyLookup>
    {
        private readonly IReadOnlyGateway<ExcedeCompanyLookup> _gateway;
        
        public ExcedeCompanyLookupService(IReadOnlyGateway<ExcedeCompanyLookup> gateway)
        {
            _gateway = gateway;
        }
        
        public async Task<ICollection<ExcedeCompanyLookup>> GetAllAsync(string accessToken)
        {
            return await _gateway.GetAllAsync(accessToken);
        }

        public async Task<ExcedeCompanyLookup> GetAsyncById(string accessToken, string id)
        {
            return await _gateway.GetAsyncById(accessToken, id);
        }
    }
}