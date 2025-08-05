using System;

namespace CRM.Domain.Contracts
{
    public interface IEntity
    {
        int Id { get; set; }
        DateTime DateCreated { get; set; }
        DateTime DateModified { get; set; }
        string UserIdModified { get; set; }
        bool Active { get; set; }  
    }
}
