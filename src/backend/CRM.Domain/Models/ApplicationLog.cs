using System;
using CRM.Domain.Contracts;

namespace CRM.Domain.Models
{
    public class ApplicationLog
    {
        public int Id { get; set; }
        public string Message { get; set; }
        public string Level { get; set; }
        public string TimeStamp { get; set; }
        public string Exception { get; set; }
        public string UserId { get; set; }
        public string Address { get; set; }
        public string TraceId { get; set; }
    }
}