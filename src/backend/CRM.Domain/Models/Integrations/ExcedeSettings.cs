using CRM.Domain.Contracts.Configuration.Integrations;

namespace CRM.Domain.Models.Integrations
{
    public class ExcedeSettings: IExcedeSettings
    {
        public string ApiToken { get; set; }
    }
}