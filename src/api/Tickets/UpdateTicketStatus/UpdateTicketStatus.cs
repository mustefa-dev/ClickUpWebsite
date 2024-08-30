using TicketSystem.Api.Tickets.Data;

namespace TicketSystem.Api.Tickets.UpdateTicketStatus;

public class UpdateTicketStatusRequest
{ 
    public required Ticket.TicketStatus NewStatus { get; set; }
}