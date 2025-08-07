using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CRM.Shared
{
    public class ResultSet<T>
    {
        [JsonProperty("items")]
        public List<T> Items { get; set; }

        [JsonProperty("totalItems")]
        public int TotalItems { get; set; }
    }
}
