using System;

namespace CRM.Domain.Models.Integrations
{
    public class ExcedeEmployeePunch
    {
        public int Id { get; set; }
        public string EmpId { get; set; }
        public int ParentItmId { get; set; }
        public int ItmTyp { get; set; }
        public string Des { get; set; }
        public object Reason { get; set; }
        public DateTime? DateStart { get; set; }
        public DateTime? DateEnd { get; set; }
        public int MinsElapsed { get; set; }
        public int HrsTyp { get; set; }
        public double AmtCostHrs { get; set; }
        public string UpdateEmpId { get; set; }
        public DateTime DateUpdate { get; set; }
        public string TS { get; set; }
    }
}