namespace CRM.Shared
{
    public interface IPaginatedResult<T>
    {
        ICollection<T> Items { get; set; }
        int Page { get; set; }
        int Limit { get; set; }
        int TotalCount { get; set; }
        int TotalPages { get; set; }
        //bool HasPreviousPage { get; }
        //bool HasNextPage { get; }
    }
}
