using System;

namespace CRM.Domain.Models.Integrations
{
    public class ExcedeVehicleSaleItem
    {
        public string Id { get; set; }
        public string SlsTypId { get; set; }
        public string SlsId { get; set; }
        public string UntId { get; set; }
        public int ItmTyp { get; set; }
        public string VhItm { get; set; }
        public string Des { get; set; }
        public double AmtPrice { get; set; }
        public double AmtCost { get; set; }
        public string TaxId { get; set; }
        public DateTime DateInvoice { get; set; }
        public string EmpId { get; set; }
    }
}