namespace TicketSystem.Api.Tickets.UpdateTicket;

public class UpdateTicketRequest
{
    public string? TicketTitle { get; set; }
    public List<string>? ImageGallery { get; set; }
}