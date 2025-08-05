using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CRM.Domain.Contracts.Integrations;
using CRM.Domain.Contracts.Services;
using CRM.Domain.Models.Integrations;

namespace CRM.Framework.Services.Integrations
{
    public class ExcedeVehicleService: IExcedeVehicleService
    {
        private readonly IExcedeAccessTokenGateway _excedeAccessTokenGateway;
        private readonly IExcedeVehicleGateway _excedeVehicleGateway;
        private readonly IReadOnlyService<ExcedeCompanyControl> _excedeCompanyControlService;        
        private readonly IReadOnlyService<ExcedeCompanyLookup> _excedeCompanyLookupService;
        private readonly IReadOnlyService<ExcedeVehicleLocation> _excedeVehicleLocationService;
        private readonly IReadOnlyService<ExcedeVehicleType> _excedeVehicleTypeService;

        public ExcedeVehicleService(
              IExcedeAccessTokenGateway excedeAccessTokenGateway
            , IExcedeVehicleGateway excedeVehicleGateway
            , IReadOnlyService<ExcedeCompanyControl> excedeCompanyControlService
            , IReadOnlyService<ExcedeCompanyLookup> excedeCompanyLookupService
            , IReadOnlyService<ExcedeVehicleLocation> excedeVehicleLocationService
            , IReadOnlyService<ExcedeVehicleType> excedeVehicleTypeService
        )
        {
            _excedeAccessTokenGateway = excedeAccessTokenGateway;
            _excedeVehicleGateway = excedeVehicleGateway;
            _excedeCompanyControlService = excedeCompanyControlService;
            _excedeCompanyLookupService = excedeCompanyLookupService;
            _excedeVehicleLocationService = excedeVehicleLocationService;
            _excedeVehicleTypeService = excedeVehicleTypeService;
        }
        public async Task<string> GetExcedeAccessToken()
        {
            return await _excedeAccessTokenGateway.GetExcedeAccessToken();
        }
        public async Task<List<ExcedeVehicle>> GetExcedeVehicles(string accessToken, string searchFilter)
        {
            return await _excedeVehicleGateway.GetExcedeVehicles(accessToken, searchFilter);
        }
        public async Task<ExcedeVehicle> GetExcedeVehicleById(string accessToken, string id)
        {
            var vehicle = await _excedeVehicleGateway.GetExcedeVehicleById(accessToken, id);
            var companyControl = (await _excedeCompanyControlService.GetAllAsync(accessToken)).Single();
            var vehicleLocation = (await _excedeVehicleLocationService.GetAsyncById(accessToken, vehicle.LocId)).Des;           
            var vehicleType = (await _excedeVehicleTypeService.GetAsyncById(accessToken, vehicle.TypId)).Des;
            var companyLookups = await _excedeCompanyLookupService.GetAllAsync(accessToken); 

            vehicle.UntMisc2Des = companyControl.UntMiscDes2;
            vehicle.UntMisc3Des = companyControl.UntMiscDes3;
            vehicle.UntMisc4Des = companyControl.UntMiscDes4;
            vehicle.UntMisc5Des = companyControl.UntMiscDes5;
            vehicle.UntMisc6Des = companyControl.UntMiscDes6;
            vehicle.UntMisc7Des = companyControl.UntMiscDes7;
            vehicle.UntMisc8Des = companyControl.UntMiscDes8;
            vehicle.UntMisc8Des = companyControl.UntMiscDes9;
            vehicle.UntMisc10Des = companyControl.UntMiscDes10;
            vehicle.UntMisc11Des = companyControl.UntMiscDes11;
            vehicle.UntMisc18Des = companyControl.UntMiscDes18;
            vehicle.UntMisc21Des = companyControl.UntMiscDes21;
            vehicle.UntMisc22Des = companyControl.UntMiscDes22;
            vehicle.UntMisc30Des = companyControl.UntMiscDes30;
            vehicle.UntMisc31Des = companyControl.UntMiscDes31;
            vehicle.UntMisc32Des = companyControl.UntMiscDes32;
            vehicle.UntMisc33Des = companyControl.UntMiscDes33;
            vehicle.UntMisc34Des = companyControl.UntMiscDes34;
            vehicle.UntMisc38Des = companyControl.UntMiscDes38;
            vehicle.UntMisc39Des = companyControl.UntMiscDes39;
            vehicle.UntMisc40Des = companyControl.UntMiscDes40;      
                  
            vehicle.LocIdDes = vehicleLocation;
            vehicle.TypIdDes = vehicleType;
                   
            vehicle.ConditionDes = companyLookups.Where(c => c.Id == vehicle.Condition.ToString()).Select(c => c.Des1).Single();
            vehicle.StatusDes = companyLookups.Where(c => c.Id == vehicle.Status.ToString()).Select(c => c.Des1).Single();
            vehicle.MarketabilityDes = companyLookups.Where(c => c.Id == vehicle.Marketability.ToString()).Select(c => c.Des1).Single();
            
            return vehicle;
        }

        public async Task<List<ExcedeVehicle>> GetExcedeServiceIntakeVehicles()
        {
            var accessToken = await this.GetExcedeAccessToken();

            return await _excedeVehicleGateway.GetExcedeVehicles(accessToken, "untmisc18!=null");
        }
    }
}