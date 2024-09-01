using TicketSystem.Api.Auth.Data;
using TicketSystem.Api.Common;
using TicketSystem.Api.Tickets.Data;

namespace TicketSystem.Api.Comments.Data;

public class Comment : BaseEntity<Ulid>
{
    public string Content { get; set; } = string.Empty;
    public Ulid CreatorId { get; set; }
    public required User Creator { get; set; }
    public Ulid TicketId { get; set; }
    public required Ticket Ticket { get; set; }
    public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
    public string? ImageUrl { get; set; }
    public string? Lat { get; set; }
    public string? Lan { get; set; }
}