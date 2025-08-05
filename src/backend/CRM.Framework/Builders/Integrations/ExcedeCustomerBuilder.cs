using System;
using CRM.Domain.Contracts.Configuration;
using CRM.Domain.Contracts.Integrations;
using CRM.Domain.Models.Integrations;

namespace CRM.Framework.Builders.Integrations
{
    public class ExcedeCustomerBuilder: IExcedeCustomerBuilder
    {
        private readonly IAppSettings _configuration;
        
        public ExcedeCustomerBuilder(IAppSettings configuration)
        {
            _configuration = configuration;
        }
        
        public ExcedeCustomer GetScaffoldExcedeCustomer(string newId = "")
        {
            if (newId == "")
            {
                // new crm customer
                // construct a unique id for excede and make sure it doesnt already exist. If so, throw message to user
                // get next id from db table that will autoincrement...
                var r = new Random();
                newId = r.Next(1, 99999999).ToString().PadLeft(8, '0'); 
            }                        
                
            // construct post object
            var excedeCustomer = new ExcedeCustomer
            {
                Id = newId,
                DateDoNotCall = DateTime.Parse("9999-12-31T00:00:00-00:00"),
                Typ = null,
                TrmId = _configuration.ExcedeCustomerSettings.TrmId,
                ShpId = _configuration.ExcedeCustomerSettings.ShpId,
                PtTaxId = _configuration.ExcedeCustomerSettings.PtTaxId,
                SvTaxId = _configuration.ExcedeCustomerSettings.SvTaxId,
                VhTaxId = _configuration.ExcedeCustomerSettings.VhTaxId,
                EmpIdSpn = _configuration.ExcedeCustomerSettings.EmpIdSpn,
                DateBirth = DateTime.Parse("9999-12-31T00:00:00-00:00"),
                DateBirthSpouse = DateTime.Parse("9999-12-31T00:00:00-00:00"),
                DsbTypId = _configuration.ExcedeCustomerSettings.DsbTypId,
                MemTypId = _configuration.ExcedeCustomerSettings.MemTypId,
                RecTypId = _configuration.ExcedeCustomerSettings.RecTypId,
                PtSlsTypId = _configuration.ExcedeCustomerSettings.PtSlsTypId,
                SvSlsTypId = _configuration.ExcedeCustomerSettings.SvSlsTypId,
                VhSlsTypId = _configuration.ExcedeCustomerSettings.VhSlsTypId,
                FlSlsTypId = _configuration.ExcedeCustomerSettings.FlSlsTypId,
                PriIdOride = _configuration.ExcedeCustomerSettings.PriIdOride,
                PriIdBase = _configuration.ExcedeCustomerSettings.PriIdBase,
                AllowSpecialPri = int.Parse(_configuration.ExcedeCustomerSettings.AllowSpecialPri),
                PurReqd = int.Parse(_configuration.ExcedeCustomerSettings.PurReqd),
                PurNbr = null,
                CoreInvoiceReqd = int.Parse(_configuration.ExcedeCustomerSettings.CoreInvoiceReqd),
                Inactive = 0,
                DateInvoice = DateTime.Parse("9999-12-31T00:00:00-00:00"),
                AmtInvoice = 0,
                DatePayment = DateTime.Parse("9999-12-31T00:00:00-00:00"),
                AmtPayment = 0,
                DaysPaymentAvg = 0,
                CutoffByCrLimit = 1,
                CutoffByAged = 1,
                CutoffAgedPeriod = int.Parse(_configuration.ExcedeCustomerSettings.CutoffAgedPeriod),
                AmtCrLimit = 0,
                AmtCrLimitInvoice = 0,
                DateStatement = DateTime.Parse("9999-12-31T00:00:00-00:00"),
                AllowFinanceChg = 0,
                AmtAged0 = 0,
                AmtAged1to30 = 0,
                AmtAged31to60 = 0,
                AmtAged61to90 = 0,
                AmtBalOpen = 0,
                AmtBalAccount = 0,
                NotId = 0,
                Company = 0,
                CusMisc1 = null,
                CusMisc2 = null,
                CusMisc3 = null,
                CusMisc4 = null,
                CusMisc5 = null
            };

            return excedeCustomer;
        }
    }
}