using System.Collections.Generic;
using System.Threading.Tasks;
using CRM.Domain.Models.Integrations;

namespace CRM.Domain.Contracts.Integrations
{
    public interface IExcedeNoteGateway
    {
        Task<List<ExcedeNote>> GetExcedeNotes(string accessToken, int notId);
        Task<ExcedeNote> CreateExcedeNote(string accessToken, ExcedeNote excedeNote);
        Task<string> GetExcedeAccessToken();
    }
}