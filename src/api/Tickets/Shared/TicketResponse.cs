using TicketSystem.Api.Tickets.Data;

namespace TicketSystem.Api.Tickets.Shared;

public class TicketResponse
{
    public Ulid Id { get; set; }
    public string? TicketTitle { get; set; }
    public string? TicketDescription { get; set; }
    public DateTime? TicketDateTime { get; set; }
    public Ticket.TicketStatus? CurrentStatus { get; set; }
    public Ulid? CreatorId { get; set; }
    public string? CreatorUsername { get; set; }  
    public List<string>? ImageGallery { get; set; }
    public List<Ulid>? AssignedUserIds { get; set; }
    public List<string>? AssignedUsernames { get; set; }  
    public DateTime? LastUpdated { get; set; }
    public long? TicketNumber { get; set; }
}
