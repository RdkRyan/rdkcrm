using System.Collections.Generic;
using System.Threading.Tasks;

namespace CRM.Domain.Contracts.Services
{
    public interface IAbstractService<T> where T : IEntity
    {
        Task<ICollection<T>> GetAsync();
        Task<T> GetAsync(int id);
        Task<T> AddAsync(T entity);
        Task<T> UpdateAsync(T entity);
        Task<int> DeleteAsync(T entity);
    }
}
