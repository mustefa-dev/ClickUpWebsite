using TicketSystem.Api.Tickets.Data;

namespace TicketSystem.Api.Tickets.AddTickets;

public class AddTicketRequest
{
    public string? TicketTitle { get; set; }
    public string? TicketDescription{ get; set; }
    public DateTime? TicketDateTime { get; set; }
    public List<string> ImageGallery { get; set; }
    public List<Ulid>? AssignedUserIds { get; set; }
}