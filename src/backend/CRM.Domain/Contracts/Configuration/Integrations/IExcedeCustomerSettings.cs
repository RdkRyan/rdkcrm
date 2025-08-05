namespace CRM.Domain.Contracts.Configuration.Integrations
{
    public interface IExcedeCustomerSettings
    {
        string TrmId { get; set; }
        string ShpId { get; set; }
        string PtTaxId { get; set; }
        string SvTaxId { get; set; }
        string VhTaxId { get; set; }
        string EmpIdSpn { get; set; }
        string DsbTypId { get; set; }
        string MemTypId { get; set; }
        string RecTypId { get; set; }
        string PtSlsTypId { get; set; }
        string SvSlsTypId { get; set; }
        string VhSlsTypId { get; set; }
        string FlSlsTypId { get; set; }
        string PriIdOride { get; set; }
        string PriIdBase { get; set; }
        string AllowSpecialPri { get; set; }
        string PurReqd { get; set; }
        string CoreInvoiceReqd { get; set; }
        string CutoffAgedPeriod { get; set; }
    }
}
