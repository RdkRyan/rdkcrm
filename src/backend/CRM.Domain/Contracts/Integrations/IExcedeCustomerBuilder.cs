using CRM.Domain.Models.Integrations;

namespace CRM.Domain.Contracts.Integrations
{
    public interface IExcedeCustomerBuilder
    {
        ExcedeCustomer GetScaffoldExcedeCustomer(string newId = "");
    }
}