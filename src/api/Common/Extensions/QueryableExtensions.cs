using System.Linq.Expressions;

namespace TicketSystem.Api.Common.Extensions;



public static class QueryableExtensions
{
    public static IQueryable<TEntityBase> ApplyPagination<TEntityBase>(this IQueryable<TEntityBase> query, IBaseListQuery listQuery)
    {
        int skip = listQuery.Skip ?? 0;
        int limit = listQuery.Limit ?? 10;
        return query.Skip(skip).Take(limit);
    }

    public static IQueryable<TEntity> ApplySorting<TEntity>(this IQueryable<TEntity> query, IBaseListQuery listQuery) where TEntity : class =>
        ApplyOrderBy(query, listQuery);
    
    private static IQueryable<TEntity> ApplyOrderBy<TEntity>(IQueryable<TEntity> query, IBaseListQuery listQuery) where TEntity : class
    {
        try
        {
            var defaultSortProperty = typeof(TEntity).GetProperty("Id") != null ? "Id" : null;
            if (defaultSortProperty == null && listQuery.SortBy == null) return query;
            var sortProperties = (listQuery.SortBy ?? defaultSortProperty)?.Split(',')
                .Select(p => p.Trim())
                .ToArray();


            if (sortProperties == null || sortProperties.Length == 0) return query;

            ValidatePropertiesExist<TEntity>(sortProperties);

            var isFirstSortProperty = true;
            foreach (var sortProperty in sortProperties)
            {
                query = ApplyOrderByHelper(query, listQuery, sortProperty, isFirstSortProperty);
                isFirstSortProperty = false;
            }

            return query;
        }
        catch (Exception) { return query; }
    }

    private static void ValidatePropertiesExist<TEntity>(string[] propertyNames)
    {
        foreach (var propertyName in propertyNames)
        {
            if (string.IsNullOrWhiteSpace(propertyName)) continue;

            var propertyInfo = typeof(TEntity).GetProperty(propertyName);
            if (propertyInfo == null) throw new ArgumentException($"No property '{propertyName}' exists on type '{typeof(TEntity).FullName}'.");
        }
    }

    private static IQueryable<TEntity> ApplyOrderByHelper<TEntity>(IQueryable<TEntity> query, IBaseListQuery listQuery, string sortProperty, bool isFirstSortProperty) where TEntity : class
    {
        var parameter = Expression.Parameter(typeof(TEntity), "x");
        var property = Expression.Property(parameter, sortProperty);
        var propertyType = property.Type;

        var delegateType = typeof(Func<,>).MakeGenericType(typeof(TEntity), propertyType);
        var lambda = Expression.Lambda(delegateType, property, parameter);

        string method;
        if (isFirstSortProperty)
            method = listQuery.SortAscending == true ? "OrderBy" : "OrderByDescending";
        else
            method = listQuery.SortAscending == true ? "ThenBy" : "ThenByDescending";

        var genericMethod = typeof(Queryable).GetMethods()
            .Single(m => m.Name == method && m.IsGenericMethodDefinition && m.GetGenericArguments()
                .Length == 2 && m.GetParameters()
                .Length == 2)
            .MakeGenericMethod(typeof(TEntity), propertyType);

        return (IQueryable<TEntity>)genericMethod.Invoke(null, new object[] { query, lambda, })!;
    }
}