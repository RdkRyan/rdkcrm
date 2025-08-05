using System;
using CRM.Domain.Contracts;

namespace CRM.Domain.Models
{
    public class HealthStatus : IEntity
    {
        public int Id { get; set; }
        public string Description { get; set; }
        public DateTime? LastInfo { get; set; }
        public DateTime? LastWarning { get; set; }
        public DateTime? LastError { get; set; }
        public DateTime? LastFatal { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime DateModified { get; set; }
        public string UserIdModified { get; set; }
        public bool Active { get; set; }
    }
}