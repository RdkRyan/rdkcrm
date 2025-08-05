using System.Collections.Generic;
using System.Threading.Tasks;
using CRM.Domain.Models.Integrations;

namespace CRM.Domain.Contracts.Integrations
{
    public interface IExcedeVehicleGateway
    {
        Task<List<ExcedeVehicle>> GetExcedeVehicles(string accessToken, string searchFilter);
        Task<ExcedeVehicle> GetExcedeVehicleById(string accessToken, string id);
    }
}