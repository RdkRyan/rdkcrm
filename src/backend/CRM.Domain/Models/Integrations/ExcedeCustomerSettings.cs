using CRM.Domain.Contracts.Configuration.Integrations;

namespace CRM.Domain.Models.Integrations
{
    public class ExcedeCustomerSettings: IExcedeCustomerSettings
    {
        public string TrmId { get; set; }
        public string ShpId { get; set; }
        public string PtTaxId { get; set; }
        public string SvTaxId { get; set; }
        public string VhTaxId { get; set; }
        public string EmpIdSpn { get; set; }
        public string DsbTypId { get; set; }
        public string MemTypId { get; set; }
        public string RecTypId { get; set; }
        public string PtSlsTypId { get; set; }
        public string SvSlsTypId { get; set; }
        public string VhSlsTypId { get; set; }
        public string FlSlsTypId { get; set; }
        public string PriIdOride { get; set; }
        public string PriIdBase { get; set; }
        public string AllowSpecialPri { get; set; }
        public string PurReqd { get; set; }
        public string CoreInvoiceReqd { get; set; }
        public string CutoffAgedPeriod { get; set; }
    }
}