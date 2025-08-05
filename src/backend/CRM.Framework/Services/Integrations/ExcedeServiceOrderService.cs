using System.Collections.Generic;
using System.Threading.Tasks;
using CRM.Domain.Contracts.Configuration;
using CRM.Domain.Contracts.Integrations;
using CRM.Domain.Models.Integrations;

namespace CRM.Framework.Services.Integrations
{
    public class ExcedeServiceOrderService: IExcedeServiceOrderService
    {
        private readonly IAppSettings _configuration;
        private readonly IExcedeServiceOrderGateway _excedeServiceOrderGateway;

        public ExcedeServiceOrderService(IAppSettings configuration, IExcedeServiceOrderGateway excedeServiceOrderGateway)
        {
            _configuration = configuration;  
            _excedeServiceOrderGateway = excedeServiceOrderGateway;
        }
        
        public async Task<List<ExcedeServiceOrder>> GetExcedeServiceOrders()
        {
            var accessToken = await _excedeServiceOrderGateway.GetExcedeAccessToken();
            return await _excedeServiceOrderGateway.GetExcedeServiceOrders(accessToken);
        }

        public async Task<ExcedeServiceOrder> GetExcedeServiceOrder(string integrationId)
        {
            var accessToken = await _excedeServiceOrderGateway.GetExcedeAccessToken();
            return await _excedeServiceOrderGateway.GetExcedeServiceOrder(accessToken, integrationId);
        }

        public async Task<List<ExcedeServiceOrderOperation>> GetExcedeServiceOrderOperationsByServiceOrderId(string excedeServiceOrderId)
        {
            var accessToken = await _excedeServiceOrderGateway.GetExcedeAccessToken();
            return await _excedeServiceOrderGateway.GetExcedeServiceOrderOperationsByServiceOrderId(accessToken, excedeServiceOrderId);
        }

        public async Task<ExcedeServiceOrderOperation> GetExcedeServiceOrderOperation(string integrationId)
        {
            var accessToken = await _excedeServiceOrderGateway.GetExcedeAccessToken();
            return await _excedeServiceOrderGateway.GetExcedeServiceOrderOperation(accessToken, integrationId);
        }

        public async Task<string> GetExcedeAccessToken()
        {
            return await _excedeServiceOrderGateway.GetExcedeAccessToken();
        }
    }
}