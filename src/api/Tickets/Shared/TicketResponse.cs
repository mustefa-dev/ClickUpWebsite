using TicketSystem.Api.Auth.Data;
using TicketSystem.Api.Tickets.Data;

namespace TicketSystem.Api.Tickets.Shared;

public class TicketResponse
{
    public Ulid Id { get; set; }
    public string? TicketTitle { get; set; }
    public Ticket.TicketStatus? CurrentStatus { get; set; }
    public Ulid? CreatorId { get; set; }
    public List<string>? ImageGallery { get; set; }
    public Ulid? AssignedUserId { get; set; }
    public DateTime? LastUpdated { get; set; }
    public long? TicketNumber { get; set; }
}