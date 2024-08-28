using TicketSystem.Api.Common;

namespace TicketSystem.Api.Auth.GetUsers;

public class GetUsersQuery : BaseListQuery
{
    public string? Query { get; set; }
    public bool? IncludeDeleted { get; set; }
}
