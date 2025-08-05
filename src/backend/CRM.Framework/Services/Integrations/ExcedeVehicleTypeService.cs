using System.Collections.Generic;
using System.Threading.Tasks;
using CRM.Domain.Contracts.Gateways;
using CRM.Domain.Contracts.Services;
using CRM.Domain.Models.Integrations;

namespace CRM.Framework.Services.Integrations
{
    public class ExcedeVehicleTypeService : IReadOnlyService<ExcedeVehicleType>
    {
        private readonly IReadOnlyGateway<ExcedeVehicleType> _gateway;

        public ExcedeVehicleTypeService(IReadOnlyGateway<ExcedeVehicleType> gateway)
        {
            _gateway = gateway;
        }

        public async Task<ICollection<ExcedeVehicleType>> GetAllAsync(string accessToken)
        {
            return await _gateway.GetAllAsync(accessToken);
        }

        public async Task<ExcedeVehicleType> GetAsyncById(string accessToken, string id)
        {
            return await _gateway.GetAsyncById(accessToken, id);
        }
    }
}