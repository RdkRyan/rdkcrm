using System.Collections.Generic;
using System.Threading.Tasks;

namespace CRM.Domain.Contracts.Health
{
    public interface IHealthStatusRepository
    {
        Task<ICollection<Models.HealthStatus>> GetAsync();
        Task<Models.HealthStatus> UpdateAsync(Models.HealthStatus entity);
    }
}
