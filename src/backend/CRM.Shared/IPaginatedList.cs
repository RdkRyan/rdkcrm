using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CRM.Shared
{
    public interface IPaginatedList<T> : IList<T>
    {
        IPaginatedResult<T> GetPaginatedList(ICollection<T> source, int? page, int? limit);
    }
}
