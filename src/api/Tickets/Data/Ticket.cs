using TicketSystem.Api.Auth.Data;
using TicketSystem.Api.Common;

namespace TicketSystem.Api.Tickets.Data;

public class Ticket : BaseEntity<Ulid>
{
    public string TicketTitle { get; set; } = string.Empty;
    public string? TicketDescription{ get; set; }
    public DateTime? TicketDateTime { get; set; }
    public TicketStatus CurrentStatus { get; set; } = TicketStatus.InProgress;

    public List<string>? ImageGallery { get; set; }

    public Ulid CreatorId { get; set; }
    public required User Creator { get; set; }

    public List<Ulid>? AssignedUserIds { get; set; }
    public List<User>? AssignedUsers { get; set; }

    public DateTime LastUpdated { get; set; } = DateTime.UtcNow;
    public long TicketNumber { get; set; }

    public enum TicketStatus
    {
        InProgress,
        Solved
    }
}
