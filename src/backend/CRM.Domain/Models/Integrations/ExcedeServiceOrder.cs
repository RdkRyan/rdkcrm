using System;

namespace CRM.Domain.Models.Integrations
{
    /// <summary>
    /// SVSLS
    /// </summary>
    public class ExcedeServiceOrder
    {
        // SlsId
        public string Id { get; set; }
            
        public string SlsTypId { get; set; }
    
        public string UntId { get; set; }
    
        public string Vin { get; set; }
    
        public string FleetUntId { get; set; }
    
        public int OdomIn { get; set; }
    
        public int OdomOut { get; set; }
    
        public int HrsEngine { get; set; }
    
        public string Tag { get; set; }
    
        public string CusId { get; set; }
    
        public string CusName { get; set; }
    
        public string CusPhone1 { get; set; }
    
        public string Ref { get; set; }
    
        public string Email { get; set; }
    
        public string EmpId { get; set; }
    
        public string EmpIdWriter { get; set; }
    
        public string EmpIdSpn { get; set; }
    
        public string EmpIdRev { get; set; }
    
        public int Priority { get; set; }
    
        public int Wait { get; set; }
    
        public int Comeback { get; set; }
    
        public int CountJobs { get; set; }
    
        public int CountJobsIncomplete { get; set; }
    
        public int CountJobsOther { get; set; }
    
        public int CountJobsIncompleteOther { get; set; }
    
        public double AmtSubtotal { get; set; }
    
        public double AmtParts { get; set; }
    
        public double AmtLabor { get; set; }
    
        public double AmtSublet { get; set; }
    
        public double AmtMisc { get; set; }
    
        public double AmtSupplies { get; set; }
    
        public double AmtDiagnostic { get; set; }
    
        public double AmtTax1 { get; set; }
    
        public double AmtTax2 { get; set; }
    
        public double AmtCostSubtotal { get; set; }
    
        public double AmtCostParts { get; set; }
    
        public double AmtCostLabor { get; set; }
    
        public double AmtCostSublet { get; set; }
    
        public double AmtCostMisc { get; set; }
    
        public double AmtSubtotalOther { get; set; }
    
        public double AmtPartsOther { get; set; }
    
        public double AmtLaborOther { get; set; }
    
        public double AmtSubletOther { get; set; }
    
        public double AmtMiscOther { get; set; }
    
        public double AmtCostSubtotalOther { get; set; }
    
        public double AmtCostPartsOther { get; set; }
    
        public double AmtCostLaborOther { get; set; }
    
        public double AmtCostSubletOther { get; set; }
    
        public double AmtCostMiscOther { get; set; }
    
        public double HrsFlat { get; set; }
    
        public double HrsBill { get; set; }
    
        public double HrsCost { get; set; }
    
        public double HrsActual { get; set; }
    
        public double HrsFlatOther { get; set; }
    
        public double HrsBillOther { get; set; }
    
        public double HrsCostOther { get; set; }
    
        public double HrsActualOther { get; set; }
    
        public string BillCusId { get; set; }
    
        public string BillCusName { get; set; }
    
        public string BillAddr1 { get; set; }
    
        public string BillAddr2 { get; set; }
    
        public string BillCity { get; set; }
    
        public string BillCounty { get; set; }
    
        public string BillState { get; set; }
    
        public string BillPost { get; set; }
    
        public string TrmId { get; set; }
    
        public string TaxId { get; set; }
    
        public string SuppliesTaxId { get; set; }
    
        public int SuppliesAuto { get; set; }
    
        public string DiagnosticTaxId { get; set; }
    
        public int DiagnosticAuto { get; set; }
    
        public int JeId { get; set; }
    
        public int Posted { get; set; }
    
        public DateTime DateCreate { get; set; }
    
        public DateTime DateUpdate { get; set; }
    
        public DateTime DateSchedule { get; set; }
    
        public DateTime DatePromise { get; set; }
    
        public DateTime? DateInvoice { get; set; }
    
        public string InvoiceSlsId { get; set; }
    
        public DateTime DateDue { get; set; }
    
        public DateTime DateDisc { get; set; }
    
        public double AmtDisc { get; set; }
    
        public int Estimate { get; set; }
    
        public string EstimateSlsId { get; set; }
    
        public DateTime DateExpire { get; set; }
    
        public double AmtEstimate { get; set; }
    
        public double AmtEstimateRevised { get; set; }
    
        public DateTime DateNotifyDiag { get; set; }
    
        public DateTime DateNotifyComplete { get; set; }
    
        public DateTime DateAuthorize { get; set; }
    
        public DateTime DateOpen { get; set; }
    
        public DateTime DateVinArrive { get; set; }
    
        public int Status { get; set; }
    
        public string BrnId { get; set; }
    
        public object TS { get; set; }
    }
}