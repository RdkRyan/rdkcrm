using CRM.Domain.Contracts.Configuration.Integrations;

namespace CRM.Domain.Contracts.Configuration
{
    public interface ISettings
    {        
        string SecurityKey { get; }
        string ValidIssuer { get; }
        string ValidAudience { get; }
        int ExpireMinutes { get; }
        string ProcedeApi { get; }
        string InsertToken { get; }
        string SelectTokenByToken { get; }
        string SelectResources { get; }
        string SelectResourceActions { get; }
        string SelectRoles { get; }
        string SelectUserById { get; }
        string SelectUserByName { get; }
        string SelectUsers { get; }
        string InsertUser { get; }
        string SelectRolesByUserName { get; }
        string UpdateUser { get; }
        string InsertUserRole { get; }
        string DeleteUserRole { get; }
        string SelectCustomers { get; }
        string SelectCustomerById { get; }
        string InsertCustomer { get; }
        string UpdateCustomer { get; }
        string DeleteCustomer { get; }
        string SelectContacts { get; }
        string SelectContactById { get; }
        string InsertContact { get; }
        string UpdateContact { get; }
        string DeleteContact { get; }
		string SelectContactsByCustomerId { get; }
		string ContactAddressSelect { get; }
		string ContactAddressByIdSelect { get; }
		string ContactAddressByContactIdSelect { get; }
		string ContactAddressInsert { get; }
		string ContactAddressUpdate  { get; }
		string ContactAddressDelete  { get; }
		string ContactEmailSelect { get; }
		string ContactEmailByIdSelect { get; }
		string ContactEmailByContactIdSelect { get; }
		string ContactEmailInsert { get; }
		string ContactEmailUpdate  { get; }
		string ContactEmailDelete  { get; }
		string VehicleSelect { get; }
		string VehicleByIdSelect { get; }
		string VehicleInsert { get; }
		string VehicleUpdate  { get; }
		string VehicleDelete  { get; }
		string CustomerByIntegrationIdSelect { get; }

        IExcedeCustomerSettings ExcedeCustomerSettings { get; }
        IExcedeSettings ExcedeSettings { get; }
		string ContactPhoneSelect { get; }
		string ContactPhoneByIdSelect { get; }
		string ContactPhoneByContactIdSelect { get; }
		string ContactPhoneInsert { get; }
		string ContactPhoneUpdate  { get; }
		string ContactPhoneDelete  { get; }
		string ApplicationLogSelect { get; }
		string ApplicationLogByIdSelect { get; }
        string CustomerNoteSelectByCustomerId { get; }
        string CustomerNoteInsert { get; }
        string ReadOnlyIntegration { get; }
        int IntegrationHoursOffset { get; }

        string HealthStatusSelect { get; }
        string HealthStatusUpdate { get; }
		string ServiceOrderSelect { get; }
		string ServiceOrderByIdSelect { get; }
		string ServiceOrderInsert { get; }
		string ServiceOrderUpdate  { get; }
		string ServiceOrderItemSelect { get; }
		string ServiceOrderItemByIdSelect { get; }
		string ServiceOrderItemByServiceOrderIdSelect { get; }
		string ServiceOrderItemByUnitIdSelect { get; }
		string ServiceOrderItemByVehicleLocationIdSelect { get; }
		string ServiceOrderItemByAssignedEmployeeIdSelect { get; }
		string ServiceOrderItemInsert { get; }
		string ServiceOrderItemUpdate  { get; }
		string ServiceJobSelect { get; }
		string ServiceJobByIdSelect { get; }
		string ServiceJobInsert { get; }
		string ServiceJobUpdate  { get; }
		string VehicleLocationSelect { get; }
		string VehicleLocationByIdSelect { get; }
		string VehicleLocationInsert { get; }
		string VehicleLocationUpdate  { get; }
		string EmployeeSelect { get; }
		string EmployeeByIdSelect { get; }
		string EmployeeInsert { get; }
		string EmployeeUpdate  { get; }
    }
}
