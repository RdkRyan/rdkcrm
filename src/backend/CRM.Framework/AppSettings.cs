using CRM.Domain.Contracts.Configuration;
using CRM.Domain.Contracts.Configuration.Integrations;
using CRM.Domain.Models.Integrations;
using Microsoft.Extensions.Configuration;

namespace CRM.Framework
{
    public class AppSettings : IAppSettings
    {
        public AppSettings()
        {
            var configuration = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appSettings.json", false)
                .AddEnvironmentVariables()
                .Build();

            SecurityKey = configuration["Auth:SecurityKey"];
            ValidIssuer = configuration["Auth:ValidIssuer"];
            ValidAudience = configuration["Auth:ValidAudience"];
            //ExpireMinutes = int.Parse(configuration["Auth:ExpireMinutes"]);
            CrmDbConnection = configuration.GetConnectionString("CrmDbConnection");
            ProcedeApi = configuration.GetSection("ProcedeApi").Value;
            InsertToken = configuration["StoredProcedures:InsertToken"];
            SelectTokenByToken = configuration["StoredProcedures:SelectTokenDetailsByToken"];
            SelectResources = configuration["StoredProcedures:SelectResources"];
            SelectResourceActions = configuration["StoredProcedures:SelectResourceActions"];
            SelectRolesByUserName = configuration["StoredProcedures:SelectRolesByUserName"];
            SelectUserById = configuration["StoredProcedures:SelectUserById"];
            SelectUserByName = configuration["StoredProcedures:SelectUserByName"];
            SelectRoles = configuration["StoredProcedures:SelectRoles"];
            UpdateUser = configuration["StoredProcedures:UpdateUser"];
            InsertUser = configuration["StoredProcedures:InsertUser"];
            InsertUserRole = configuration["StoredProcedures:InsertUserRole"];
            DeleteUserRole = configuration["StoredProcedures:DeleteUserRole"];
            SelectUsers = configuration["StoredProcedures:SelectUsers"];
            SelectCustomers = configuration["StoredProcedures:SelectCustomers"];
            SelectCustomerById = configuration["StoredProcedures:SelectCustomerById"];
            InsertCustomer = configuration["StoredProcedures:InsertCustomer"];
            UpdateCustomer = configuration["StoredProcedures:UpdateCustomer"];
            DeleteCustomer = configuration["StoredProcedures:DeleteCustomer"];
            SelectContacts = configuration["StoredProcedures:SelectContacts"];
            SelectContactById = configuration["StoredProcedures:SelectContactById"];
            InsertContact = configuration["StoredProcedures:InsertContact"];
            UpdateContact = configuration["StoredProcedures:UpdateContact"];
            DeleteContact = configuration["StoredProcedures:DeleteContact"];
            SelectContactsByCustomerId = configuration["StoredProcedures:SelectContactsByCustomerId"];
            ContactAddressSelect = configuration["StoredProcedures:ContactAddressSelect"];
            ContactAddressByIdSelect = configuration["StoredProcedures:ContactAddressByIdSelect"];
            ContactAddressByContactIdSelect = configuration["StoredProcedures:ContactAddressByContactIdSelect"];
            ContactAddressInsert = configuration["StoredProcedures:ContactAddressInsert"];
            ContactAddressUpdate = configuration["StoredProcedures:ContactAddressUpdate "];
            ContactAddressDelete = configuration["StoredProcedures:ContactAddressDelete "];
            ContactEmailSelect = configuration["StoredProcedures:ContactEmailSelect"];
            ContactEmailByIdSelect = configuration["StoredProcedures:ContactEmailByIdSelect"];
            ContactEmailByContactIdSelect = configuration["StoredProcedures:ContactEmailByContactIdSelect"];
            ContactEmailInsert = configuration["StoredProcedures:ContactEmailInsert"];
            ContactEmailUpdate = configuration["StoredProcedures:ContactEmailUpdate "];
            ContactEmailDelete = configuration["StoredProcedures:ContactEmailDelete "];
            VehicleSelect = configuration["StoredProcedures:VehicleSelect"];
            VehicleByIdSelect = configuration["StoredProcedures:VehicleByIdSelect"];
            VehicleInsert = configuration["StoredProcedures:VehicleInsert"];
            VehicleUpdate = configuration["StoredProcedures:VehicleUpdate "];
            VehicleDelete = configuration["StoredProcedures:VehicleDelete "];
            CustomerByIntegrationIdSelect = configuration["StoredProcedures:CustomerByIntegrationIdSelect"];
            ContactPhoneSelect = configuration["StoredProcedures:ContactPhoneSelect"];
            ContactPhoneByIdSelect = configuration["StoredProcedures:ContactPhoneByIdSelect"];
            ContactPhoneByContactIdSelect = configuration["StoredProcedures:ContactPhoneByContactIdSelect"];
            ContactPhoneInsert = configuration["StoredProcedures:ContactPhoneInsert"];
            ContactPhoneUpdate = configuration["StoredProcedures:ContactPhoneUpdate "];
            ContactPhoneDelete = configuration["StoredProcedures:ContactPhoneDelete "];
            ApplicationLogSelect = configuration["StoredProcedures:ApplicationLogSelect"];
            ApplicationLogByIdSelect = configuration["StoredProcedures:ApplicationLogByIdSelect"];
            CustomerNoteSelectByCustomerId = configuration["StoredProcedures:CustomerNoteSelectByCustomerId"];
            CustomerNoteInsert = configuration["StoredProcedures:CustomerNoteInsert"];
            ReadOnlyIntegration = configuration.GetSection("ReadOnlyIntegration").Value;
            IntegrationHoursOffset = int.Parse(configuration.GetSection("IntegrationHoursOffset").Value);
            HealthStatusSelect = configuration["StoredProcedures:HealthStatusSelect"];
            HealthStatusUpdate = configuration["StoredProcedures:HealthStatusUpdate"];
            ServiceOrderSelect = configuration["StoredProcedures:ServiceOrderSelect"];
            ServiceOrderByIdSelect = configuration["StoredProcedures:ServiceOrderByIdSelect"];
            ServiceOrderByUnitIdSelect = configuration["StoredProcedures:ServiceOrderByUnitIdSelect"];
            ServiceOrderInsert = configuration["StoredProcedures:ServiceOrderInsert"];
            ServiceOrderUpdate = configuration["StoredProcedures:ServiceOrderUpdate "];
            ServiceOrderItemSelect = configuration["StoredProcedures:ServiceOrderItemSelect"];
            ServiceOrderItemByIdSelect = configuration["StoredProcedures:ServiceOrderItemByIdSelect"];
            ServiceOrderItemByServiceOrderIdSelect = configuration["StoredProcedures:ServiceOrderItemByServiceOrderIdSelect"];
            ServiceOrderItemByUnitIdSelect = configuration["StoredProcedures:ServiceOrderItemByUnitIdSelect"];
            ServiceOrderItemByVehicleLocationIdSelect = configuration["StoredProcedures:ServiceOrderItemByVehicleLocationIdSelect"];
            ServiceOrderItemByAssignedEmployeeIdSelect = configuration["StoredProcedures:ServiceOrderItemByAssignedEmployeeIdSelect"];
            ServiceOrderItemInsert = configuration["StoredProcedures:ServiceOrderItemInsert"];
            ServiceOrderItemUpdate = configuration["StoredProcedures:ServiceOrderItemUpdate "];
            ServiceJobSelect = configuration["StoredProcedures:ServiceJobSelect"];
            ServiceJobByIdSelect = configuration["StoredProcedures:ServiceJobByIdSelect"];
            ServiceJobInsert = configuration["StoredProcedures:ServiceJobInsert"];
            ServiceJobUpdate = configuration["StoredProcedures:ServiceJobUpdate "];
            VehicleLocationSelect = configuration["StoredProcedures:VehicleLocationSelect"];
            VehicleLocationByIdSelect = configuration["StoredProcedures:VehicleLocationByIdSelect"];
            VehicleLocationInsert = configuration["StoredProcedures:VehicleLocationInsert"];
            VehicleLocationUpdate = configuration["StoredProcedures:VehicleLocationUpdate "];
            EmployeeSelect = configuration["StoredProcedures:EmployeeSelect"];
            EmployeeByIdSelect = configuration["StoredProcedures:EmployeeByIdSelect"];
            EmployeeInsert = configuration["StoredProcedures:EmployeeInsert"];
            EmployeeUpdate = configuration["StoredProcedures:EmployeeUpdate "];

            ExcedeCustomerSettings = new ExcedeCustomerSettings
            {
                DsbTypId = configuration["ExcedeCustomerDefaults:DsbTypId"],
                MemTypId = configuration["ExcedeCustomerDefaults:MemTypId"],
                RecTypId = configuration["ExcedeCustomerDefaults:RecTypId"],
                PtSlsTypId = configuration["ExcedeCustomerDefaults:PtSlsTypId"],
                SvSlsTypId = configuration["ExcedeCustomerDefaults:SvSlsTypId"],
                VhSlsTypId = configuration["ExcedeCustomerDefaults:VhSlsTypId"],
                FlSlsTypId = configuration["ExcedeCustomerDefaults:FlSlsTypId"],
                PriIdOride = configuration["ExcedeCustomerDefaults:PriIdOride"],
                PriIdBase = configuration["ExcedeCustomerDefaults:PriIdBase"],
                TrmId = configuration["ExcedeCustomerDefaults:TrmId"],
                ShpId = configuration["ExcedeCustomerDefaults:ShpId"],
                PtTaxId = configuration["ExcedeCustomerDefaults:PtTaxId"],
                SvTaxId = configuration["ExcedeCustomerDefaults:SvTaxId"],
                VhTaxId = configuration["ExcedeCustomerDefaults:VhTaxId"],
                EmpIdSpn = configuration["ExcedeCustomerDefaults:EmpIdSpn"],
                AllowSpecialPri = configuration["ExcedeCustomerDefaults:AllowSpecialPri"],
                PurReqd = configuration["ExcedeCustomerDefaults:PurReqd"],
                CoreInvoiceReqd = configuration["ExcedeCustomerDefaults:CoreInvoiceReqd"],
                CutoffAgedPeriod = configuration["ExcedeCustomerDefaults:CutoffAgedPeriod"],
            };

            ExcedeSettings = new ExcedeSettings
            {
                ApiToken = configuration["ExcedeApiToken"]
            };
        }

        public string InsertToken { get; }
        public string SelectTokenByToken { get; }
        public string SecurityKey { get; }
        public string ValidIssuer { get; }
        public string ValidAudience { get; }
        public int ExpireMinutes { get; }
        public string CrmDbConnection { get; }
        public string ProcedeApi { get; }
        public string SelectResources { get; }
        public string SelectResourceActions { get; }
        public string SelectRoles { get; }
        public string SelectUserById { get; }
        public string SelectUserByName { get; }
        public string SelectUsers { get; }
        public string InsertUser { get; }
        public string SelectRolesByUserName { get; }
        public string UpdateUser { get; }
        public string InsertUserRole { get; }
        public string DeleteUserRole { get; }
        public string SelectCustomers { get; }
        public string SelectCustomerById { get; }
        public string InsertCustomer { get; }
        public string UpdateCustomer { get; }
        public string DeleteCustomer { get; }
        public string SelectContacts { get; }
        public string SelectContactById { get; }
        public string InsertContact { get; }
        public string UpdateContact { get; }
        public string DeleteContact { get; }
        public string SelectContactsByCustomerId { get; }
        public string ContactAddressSelect { get; }
        public string ContactAddressByIdSelect { get; }
        public string ContactAddressByContactIdSelect { get; }
        public string ContactAddressInsert { get; }
        public string ContactAddressUpdate { get; }
        public string ContactAddressDelete { get; }
        public string ContactEmailSelect { get; }
        public string ContactEmailByIdSelect { get; }
        public string ContactEmailByContactIdSelect { get; }
        public string ContactEmailInsert { get; }
        public string ContactEmailUpdate { get; }
        public string ContactEmailDelete { get; }
        public string VehicleSelect { get; }
        public string VehicleByIdSelect { get; }
        public string VehicleInsert { get; }
        public string VehicleUpdate { get; }
        public string VehicleDelete { get; }
        public string CustomerByIntegrationIdSelect { get; }
        public IExcedeCustomerSettings ExcedeCustomerSettings { get; }
        public IExcedeSettings ExcedeSettings { get; }
        public string ContactPhoneSelect { get; }
        public string ContactPhoneByIdSelect { get; }
        public string ContactPhoneByContactIdSelect { get; }
        public string ContactPhoneInsert { get; }
        public string ContactPhoneUpdate { get; }
        public string ContactPhoneDelete { get; }
        public string ApplicationLogSelect { get; }
        public string ApplicationLogByIdSelect { get; }
        public string CustomerNoteSelectByCustomerId { get; }
        public string CustomerNoteInsert { get; }
        public string ReadOnlyIntegration { get; }
        public int IntegrationHoursOffset { get; }
        public string HealthStatusSelect { get; }
        public string HealthStatusUpdate { get; }
        public string ServiceOrderSelect { get; }
        public string ServiceOrderByIdSelect { get; }
        public string ServiceOrderByUnitIdSelect { get; }
        public string ServiceOrderInsert { get; }
        public string ServiceOrderUpdate { get; }
        public string ServiceOrderItemSelect { get; }
        public string ServiceOrderItemByIdSelect { get; }
        public string ServiceOrderItemByServiceOrderIdSelect { get; }
        public string ServiceOrderItemByUnitIdSelect { get; }
        public string ServiceOrderItemByVehicleLocationIdSelect { get; }
        public string ServiceOrderItemByAssignedEmployeeIdSelect { get; }
        public string ServiceOrderItemInsert { get; }
        public string ServiceOrderItemUpdate { get; }
        public string ServiceJobSelect { get; }
        public string ServiceJobByIdSelect { get; }
        public string ServiceJobInsert { get; }
        public string ServiceJobUpdate { get; }
        public string VehicleLocationSelect { get; }
        public string VehicleLocationByIdSelect { get; }
        public string VehicleLocationInsert { get; }
        public string VehicleLocationUpdate { get; }
        public string EmployeeSelect { get; }
        public string EmployeeByIdSelect { get; }
        public string EmployeeInsert { get; }
        public string EmployeeUpdate { get; }
    }
}
