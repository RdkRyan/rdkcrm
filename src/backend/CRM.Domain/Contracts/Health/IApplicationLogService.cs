using System.Collections.Generic;
using System.Threading.Tasks;

namespace CRM.Domain.Contracts.Health
{
    public interface IApplicationLogService
    {
        Task<ICollection<Models.ApplicationLog>> GetApplicationLogAsync();
        Task<Models.ApplicationLog> GetApplicationLogByIdAsync(int id);
    }
}
