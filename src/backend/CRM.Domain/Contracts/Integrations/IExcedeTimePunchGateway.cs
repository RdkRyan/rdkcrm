using System.Collections.Generic;
using System.Threading.Tasks;
using CRM.Domain.Models.Integrations;

namespace CRM.Domain.Contracts.Integrations
{
    public interface IExcedeTimePunchGateway
    {
        Task<string> GetExcedeAccessToken();       
        Task<List<ExcedeEmployeePunch>> GetExcedeEmployeePunchesFromPreviousDayWithoutEndDates(string accessToken);
        Task<List<ExcedeCompanyShift>> GetExcedeCompanyShifts(string accessToken);
        Task<List<ExcedeCompanyShiftEmployee>> GetExcedeCompanyShiftEmployees(string accessToken);
    }
}