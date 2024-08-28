namespace TicketSystem.Api.Common;

public class BaseEntity<TId>
{
    public required TId Id { get; set; }

    public bool Deleted { get; set; } = false;
    public DateTime? CreationDate { get; set; } = DateTime.UtcNow;
}