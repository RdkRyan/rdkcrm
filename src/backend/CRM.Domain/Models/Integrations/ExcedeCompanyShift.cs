using System;

namespace CRM.Domain.Models.Integrations
{
    public class ExcedeCompanyShift
    {
        public string Id { get; set; }
        public string Des { get; set; }
        public int MinsGrace { get; set; }
        public int HrsOvertime { get; set; }
        public int HrsDoubletime { get; set; }
        public int HrsInWorkWeek { get; set; }
        public int DayOfWorkWeek { get; set; }
        public DateTime TimeStartSun { get; set; }
        public DateTime TimeEndSun { get; set; }
        public DateTime TimeStartMon { get; set; }
        public DateTime TimeEndMon { get; set; }
        public DateTime TimeStartTue { get; set; }
        public DateTime TimeEndTue { get; set; }
        public DateTime TimeStartWed { get; set; }
        public DateTime TimeEndWed { get; set; }
        public DateTime TimeStartThu { get; set; }
        public DateTime TimeEndThu { get; set; }
        public DateTime TimeStartFri { get; set; }
        public DateTime TimeEndFri { get; set; }
        public DateTime TimeStartSat { get; set; }
        public DateTime TimeEndSat { get; set; }
        public string TS { get; set; }
    }
}