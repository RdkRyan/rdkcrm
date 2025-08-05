using System;

namespace CRM.Domain.Models.Integrations
{
    public class ExcedeServiceOrderOperation
    {
        public string Id { get; set; }
        
        public string SlsId { get; set; }

        public int OpsId { get; set; }

        public string JobId { get; set; }

        public string SlsTypId { get; set; }

        public string Condition { get; set; }

        public string Cause { get; set; }

        public string Correction { get; set; }

        public string FailedPrtId { get; set; }

        public string ClmNbr { get; set; }

        public double AmtClm { get; set; }

        public int UseJobPrices { get; set; }

        public int Request { get; set; }

        public int Status { get; set; }

        public string EmpId { get; set; }

        public string EmpIdSpn { get; set; }

        public double AmtParts { get; set; }

        public double AmtCostParts { get; set; }

        public double AmtLabor { get; set; }

        public double AmtCostLabor { get; set; }

        public double AmtSublet { get; set; }

        public double AmtCostSublet { get; set; }

        public double AmtMisc { get; set; }

        public double AmtCostMisc { get; set; }

        public double AmtTax { get; set; }

        public double AmtSubtotal { get; set; }

        public DateTime DateExpire { get; set; }

        public DateTime DateCreate { get; set; }

        public DateTime DateUpdate { get; set; }

        public int Complete { get; set; }

        public int NotId { get; set; }
    }
}