using System.Collections.Generic;
using System.Threading.Tasks;
namespace CRM.Domain.Contracts.Services
{
    public interface IReadOnlyService<T>
    {
        Task<ICollection<T>> GetAllAsync(string accessToken);
        Task<T> GetAsyncById(string accessToken, string id);
    }
}