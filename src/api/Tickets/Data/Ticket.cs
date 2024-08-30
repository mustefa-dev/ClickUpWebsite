using TicketSystem.Api.Auth.Data;
using TicketSystem.Api.Common;

namespace TicketSystem.Api.Tickets.Data;

public class Ticket : BaseEntity<Ulid>
{
    public string TicketTitle { get; set; } = string.Empty;
    public TicketStatus CurrentStatus { get; set; } = TicketStatus.InProgress;

    public List<string>? ImageGallery { get; set; }

    public Ulid CreatorId { get; set; }
    public required User Creator { get; set; }

    public Ulid? AssignedUserId { get; set; }
    public User? AssignedUser { get; set; }

    public DateTime LastUpdated { get; set; } = DateTime.UtcNow;
    public long TicketNumber { get; set; }

    public enum TicketStatus
    {
        InProgress,
        Solved
    }
}