using System.Threading.Tasks;

namespace CRM.Domain.Contracts.Integrations
{
    public interface IExcedeTimePunchService
    {
        Task<string> GetExcedeAccessToken();
    }
}