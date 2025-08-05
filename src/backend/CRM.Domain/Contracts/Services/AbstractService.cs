using System.Collections.Generic;
using System.Threading.Tasks;

namespace CRM.Domain.Contracts.Services
{
    public abstract class AbstractService<T> : IAbstractService<T> where T : IEntity
    {
        public abstract Task<ICollection<T>> GetAsync();
        public abstract Task<T> GetAsync(int id);
        public abstract Task<T> AddAsync(T entity);
        public abstract Task<T> UpdateAsync(T entity);
        public abstract Task<int> DeleteAsync(T entity);
    }
}
