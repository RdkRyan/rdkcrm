using System.Collections.Generic;
using System.Threading.Tasks;
using CRM.Domain.Models.Integrations;

namespace CRM.Domain.Contracts.Integrations
{
    public interface IExcedeVehicleSaleGateway
    {
        Task<string> GetExcedeAccessToken();
        Task<List<ExcedeVehicleSale>> GetExcedeVehicleSales(string accessToken);
        Task<ExcedeVehicleSale> GetExcedeVehicleSale(string accessToken, string id);
        Task<List<ExcedeVehicleSale>> GetExcedeVehicleSalesByCustomerId(string accessToken, string customerId);
        Task<List<ExcedeVehicleSaleItem>> GetExcedeVehicleSaleItems(string accessToken, string id);
    }
}
