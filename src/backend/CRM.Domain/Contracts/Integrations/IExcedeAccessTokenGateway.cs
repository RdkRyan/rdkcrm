using System.Threading.Tasks;

namespace CRM.Domain.Contracts.Integrations
{
    public interface IExcedeAccessTokenGateway
    {
        Task<string> GetExcedeAccessToken();
    }
}
