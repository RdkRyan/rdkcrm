using System.Collections.Generic;
using System.Threading.Tasks;
using CRM.Domain.Models.Integrations;

namespace CRM.Domain.Contracts.Integrations
{
    public interface IExcedeServiceOrderService
    {
        Task<List<ExcedeServiceOrder>> GetExcedeServiceOrders();

        Task<ExcedeServiceOrder> GetExcedeServiceOrder(string integrationId);
        
        Task<List<ExcedeServiceOrderOperation>> GetExcedeServiceOrderOperationsByServiceOrderId(string excedeServiceOrderId);

        Task<ExcedeServiceOrderOperation> GetExcedeServiceOrderOperation(string integrationId);
        
        Task<string> GetExcedeAccessToken();
    }
}