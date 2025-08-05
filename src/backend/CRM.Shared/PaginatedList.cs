using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CRM.Shared
{
    public class PaginatedList<T> : List<T>, IPaginatedList<T>
    {
        public readonly IPaginatedResult<T> _paginatedResult;

        public PaginatedList(IPaginatedResult<T> paginatedResult)
        {
            _paginatedResult = paginatedResult;
        }

        public IPaginatedResult<T> GetPaginatedList(ICollection<T> source, int? page, int? limit)
        {
            _paginatedResult.Page = page ?? 0;
            _paginatedResult.Limit = (limit == null || limit == 0) ? source.Count() : (int)limit;
            _paginatedResult.TotalCount = source.Count();
            _paginatedResult.TotalPages = (_paginatedResult.Limit < 1 && _paginatedResult.TotalCount < 1 ? 0 : (int)Math.Ceiling(_paginatedResult.TotalCount / (double)_paginatedResult.Limit));

            AddRange(source.Skip(_paginatedResult.Page * _paginatedResult.Limit).Take(_paginatedResult.Limit));

            _paginatedResult.Items = this.ToList();

            return _paginatedResult;
        }
    }
}
