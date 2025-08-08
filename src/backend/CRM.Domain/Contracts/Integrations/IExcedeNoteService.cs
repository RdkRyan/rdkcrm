using CRM.Domain.Models.Integrations;

namespace CRM.Domain.Contracts.Integrations
{
    public interface IExcedeNoteService
    {
        Task<ICollection<ExcedeNote>> GetByCustomerIdAsync(string customerId);
        Task<ExcedeNote> AddAsync(ExcedeNote entity, string customerId);
    }
}
