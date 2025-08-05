namespace CRM.Domain.Models.Integrations
{
    public class ExcedeEmployeePunchIn
    {
        public string EmpId { get; set; }
        public int LaborItemId { get; set; }
        public int PunchTypeId { get; set; }
        public string Description { get; set; }
    }
}