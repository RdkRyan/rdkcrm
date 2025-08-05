using System;

namespace CRM.Domain.Models.Integrations
{
    /// <summary>
    /// SVSLSITM
    /// </summary>
    public class ExcedeServiceOrderItem
    {
        // ItmId 
        public int Id { get; set; }

        public string SlsId { get; set; }

        public int OpsId { get; set; }

        public int ItmTyp { get; set; }

        public string SvItm { get; set; }

        public string Des { get; set; }

        public string Reason { get; set; }

        public double AmtPrice { get; set; }

        public double AmtPriceSuggest { get; set; }

        public double AmtCost { get; set; }

        public double QtyShip { get; set; }

        public double QtyBackorder { get; set; }

        public double HrsFlat { get; set; }

        public double HrsBill { get; set; }

        public double HrsCost { get; set; }

        public double HrsActual { get; set; }

        public int MinsPerSegment { get; set; }

        public int UseHrsFlat { get; set; }

        public int Complete { get; set; }

        public DateTime DatePayPeriod { get; set; }

        public string EmpIdLbr { get; set; }

        public string TaxId { get; set; }

        public string EmpId { get; set; }

        public string EmpIdSpn { get; set; }

        public DateTime DateCreate { get; set; }

        public DateTime DateUpdate { get; set; }

        public object TS { get; set; }
    }
}