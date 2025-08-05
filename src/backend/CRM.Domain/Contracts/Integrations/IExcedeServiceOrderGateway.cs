using System.Collections.Generic;
using System.Threading.Tasks;
using CRM.Domain.Models.Integrations;

namespace CRM.Domain.Contracts.Integrations
{
    public interface IExcedeServiceOrderGateway
    {
        Task<List<ExcedeServiceOrder>> GetExcedeServiceOrders(string accessToken);

        Task<ExcedeServiceOrder> GetExcedeServiceOrder(string accessToken, string integrationId);
        
        Task<List<ExcedeServiceOrderOperation>> GetExcedeServiceOrderOperationsByServiceOrderId(string accessToken, string excedeServiceOrderId);

        Task<ExcedeServiceOrderOperation> GetExcedeServiceOrderOperation(string accessToken, string integrationId);
        
        Task<string> GetExcedeAccessToken();
    }
}