using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CRM.Shared
{
    //  IPaginatedList<T>

    public class PaginatedList<T>
    {
        public List<T> Items { get; set; } = new();
        public PaginationMetadata Metadata { get; set; } = new();
    }
}
