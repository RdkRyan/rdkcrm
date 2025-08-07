using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CRM.Shared
{
    public class PaginatedResponse<T>
    {
        public List<T> Items { get; set; }
        public PaginationMetadata Metadata { get; set; }
    }

    public class PaginationMetadata
    {
        public int Page { get; set; }
        public int Limit { get; set; }
        public int TotalCount { get; set; }
        public int TotalPages { get; set; }
        public bool HasPreviousPage => Page > 0;
        public bool HasNextPage => Page + 1 < TotalPages;
    }
}
