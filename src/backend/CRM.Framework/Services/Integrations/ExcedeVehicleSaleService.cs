using System.Collections.Generic;
using System.Threading.Tasks;
using CRM.Domain.Contracts.Configuration;
using CRM.Domain.Models.Integrations;
using CRM.Domain.Contracts.Integrations;
using System.Linq;

namespace CRM.Framework.Services.Integrations
{
    public class ExcedeVehicleSaleService : IExcedeVehicleSaleService
    {
        private readonly IAppSettings _configuration;
        private readonly IExcedeVehicleSaleGateway _excedeVehicleSaleGateway;
        private readonly IExcedeEmployeeService _excedeEmployeeService;

        public ExcedeVehicleSaleService(
            IAppSettings configuration,
            IExcedeVehicleSaleGateway excedeVehicleSalesHistoryGateway,
            IExcedeEmployeeService excedeEmployeeService
            )
        {
            _configuration = configuration;
            _excedeVehicleSaleGateway = excedeVehicleSalesHistoryGateway;
            _excedeEmployeeService = excedeEmployeeService;
        }

        public async Task<List<ExcedeVehicleSale>> GetExcedeVehicleSales(string accessToken)
        {
            return await _excedeVehicleSaleGateway.GetExcedeVehicleSales(accessToken);
        }
        
        public async Task<ExcedeVehicleSale> GetExcedeVehicleSale(string accessToken, string id)
        {
            return await _excedeVehicleSaleGateway.GetExcedeVehicleSale(accessToken, id);
        }
        
        public async Task<List<ExcedeVehicleSaleItem>> GetExcedeVehicleSaleItems(string accessToken, string salesId)
        {
            return await _excedeVehicleSaleGateway.GetExcedeVehicleSaleItems(accessToken, salesId);;
        }

        public async Task<List<ExcedeVehicleSale>> GetExcedeVehicleSaleByCustomerId(string accessToken, string customerId)
        {
            var sales = await _excedeVehicleSaleGateway.GetExcedeVehicleSalesByCustomerId(accessToken, customerId);      
            var emp = await _excedeEmployeeService.GetExcedeEmployees(accessToken);
            
            foreach (var sale in sales)
            {
                sale.EmpName = emp.Where(e => e.Id == sale.EmpId).Select(e => e.Name).Single().Trim();
            }       

            return sales;
        }

        public async Task<string> GetExcedeAccessToken()
        {
            return await _excedeVehicleSaleGateway.GetExcedeAccessToken();
        }
    }
}