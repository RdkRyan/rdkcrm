using System.Collections.Generic;
using System.Threading.Tasks;

namespace CRM.Domain.Contracts.Health
{
    public interface IHealthStatusService
    {
        Task<ICollection<Models.HealthStatus>> GetAsync();
        Task<Models.HealthStatus> UpdateAsync(Models.HealthStatus entity);
    }
}
