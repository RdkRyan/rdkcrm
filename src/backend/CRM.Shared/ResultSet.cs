using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CRM.Shared
{
    public class ResultSet<T>
    {
        public int TotalItems { get; set; }
        public List<T> Items { get; set; }
        public int Limit { get; set; }
        public int Skip { get; set; }
    }
}
