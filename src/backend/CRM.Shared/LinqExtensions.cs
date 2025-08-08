namespace CRM.Shared
{
    public static class LinqExtensions
    {
        public static IEnumerable<T> OrderByDynamic<T>(this IEnumerable<T> source, string propertyName)
        {
            if (string.IsNullOrWhiteSpace(propertyName)) return source;

            var prop = typeof(T).GetProperty(propertyName);
            return prop == null ? source : source.OrderBy(x => prop.GetValue(x, null));
        }
    }
}
