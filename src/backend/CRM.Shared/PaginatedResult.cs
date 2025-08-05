using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CRM.Shared
{
    public class PaginatedResult<T> : IPaginatedResult<T>
    {
        public int Page { get; set; }
        public int Limit { get; set; }
        public int TotalCount { get; set; }
        public int TotalPages { get; set; }
        public ICollection<T> Items { get; set; }

        public bool HasPreviousPage
        {
            get
            {
                return (Page > 0);
            }
        }

        public bool HasNextPage
        {
            get
            {
                return (Page + 1 < TotalPages);
            }
        }
    }
}
