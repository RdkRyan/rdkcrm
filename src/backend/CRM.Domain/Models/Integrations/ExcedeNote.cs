using System;

namespace CRM.Domain.Models.Integrations
{
    public class ExcedeNote
    {
        public int Id { get; set; }

        public int NotId { get; set; }

        public int Important { get; set; }

        public string EmpId { get; set; }

        public string EmpName { get; set; }
        
        public string Password { get; set; }

        public DateTime DateCreate { get; set; }

        public DateTime DateUpdate { get; set; }

        public string Subject { get; set; }

        public string Des { get; set; }

        public byte[] TS { get; set; }
    }
}