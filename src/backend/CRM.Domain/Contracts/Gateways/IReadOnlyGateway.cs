using System.Collections.Generic;
using System.Threading.Tasks;
namespace CRM.Domain.Contracts.Gateways
{
    public interface IReadOnlyGateway<T>
    {
        Task<ICollection<T>> GetAllAsync(string accessToken);
        Task<T> GetAsyncById(string accessToken, string id);
    }
}