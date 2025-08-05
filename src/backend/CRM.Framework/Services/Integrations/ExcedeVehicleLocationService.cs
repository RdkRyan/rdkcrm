using System.Collections.Generic;
using System.Threading.Tasks;
using CRM.Domain.Contracts.Gateways;
using CRM.Domain.Contracts.Services;
using CRM.Domain.Models.Integrations;

namespace CRM.Framework.Services.Integrations
{
    public class ExcedeVehicleLocationService : IReadOnlyService<ExcedeVehicleLocation>
    {
        private readonly IReadOnlyGateway<ExcedeVehicleLocation> _gateway;

        public ExcedeVehicleLocationService(IReadOnlyGateway<ExcedeVehicleLocation> gateway)
        {
            _gateway = gateway;
        }

        public async Task<ICollection<ExcedeVehicleLocation>> GetAllAsync(string accessToken)
        {
            return await _gateway.GetAllAsync(accessToken);
        }

        public async Task<ExcedeVehicleLocation> GetAsyncById(string accessToken, string id)
        {
            return await _gateway.GetAsyncById(accessToken, id);
        }
    }
}