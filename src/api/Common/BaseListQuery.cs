namespace TicketSystem.Api.Common;

public interface IBaseListQuery
{
    public bool? SortAscending { get; set; }
    public string? SortBy { get; set; }
    public int? Limit { get; set; }
    public int? Skip { get; set; }
}

public class BaseListQuery : IBaseListQuery
{
    public bool? SortAscending { get; set; }
    public string? SortBy { get; set; }
    public int? Limit { get; set; }
    public int? Skip { get; set; }
}
